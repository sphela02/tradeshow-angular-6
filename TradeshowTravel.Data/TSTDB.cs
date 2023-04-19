using System.Data.Entity;
using System.Data.Entity.Core.Objects;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace TradeshowTravel.Data
{
    using Configurations;
    using Models;
    using Domain;
    using Domain.DTOs;

    public class TSTDB: DbContext
    {
        private string EncryptionPwdHash { get; set; }
        private NLog.ILogger theLogger { get; }

        public TSTDB() : base(CredentialProvider.TSTConnectionString)
        {
            ((IObjectContextAdapter)this).ObjectContext.ObjectMaterialized += ObjectContext_ObjectMaterialized;

            this.EncryptionPwdHash = CredentialProvider.DBEncryptionPassword;

            theLogger = NLog.LogManager.GetCurrentClassLogger();

            this.Database.Log = sql => theLogger.Trace(sql);
        }
                
        public virtual DbSet<Attendee> Attendees { get; set; }
        public virtual DbSet<AttendeeValue> AttendeeValues { get; set; }
        public virtual DbSet<DefaultField> DefaultFields { get; set; }
        public virtual DbSet<Segment> Segments { get; set; }
        public virtual DbSet<Tradeshow> Tradeshows { get; set; }
        public virtual DbSet<TradeshowField> TradeshowFields { get; set; }
        public virtual DbSet<TradeshowRoomBlock> TradeshowRoomBlocks { get; set; }
        public virtual DbSet<TradeshowUser> TradeshowUsers { get; set; }
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<UserImages> UserImages { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Configurations.Add(new AttendeeConfig());
            modelBuilder.Configurations.Add(new AttendeeValueConfig());
            modelBuilder.Configurations.Add(new DefaultFieldConfig());
            modelBuilder.Configurations.Add(new SegmentConfig());
            modelBuilder.Configurations.Add(new TradeshowConfig());
            modelBuilder.Configurations.Add(new TradeshowFieldConfig());
            modelBuilder.Configurations.Add(new TradeshowRoomBlockConfig());
            modelBuilder.Configurations.Add(new TradeshowUserConfig());
            modelBuilder.Configurations.Add(new UserConfig());
            modelBuilder.Configurations.Add(new UserImageConfig());

            
            // UserAvatar has a user profile
            // and a user profile can be tied to one user avatar record.
            //modelBuilder.Entity<UserProfilePic>()
            //    .HasRequired(upp => upp.Username);



            // Tradeshow has many attendees
            // and an attendee has one tradeshow
            modelBuilder.Entity<Tradeshow>()
                .HasMany(ts => ts.Attendees)
                .WithRequired(a => a.Tradeshow)
                .HasForeignKey(a => a.TradeshowID);

            // Tradeshow has many fields
            // and field has one tradeshow
            modelBuilder.Entity<Tradeshow>()
                .HasMany(ts => ts.Fields)
                .WithRequired(f => f.Tradeshow)
                .HasForeignKey(f => f.TradeshowID);

            // Tradeshow has many users
            // and user has one tradeshow
            modelBuilder.Entity<Tradeshow>()
                .HasMany(ts => ts.Users)
                .WithRequired(f => f.Tradeshow)
                .HasForeignKey(f => f.TradeshowID);

            // Tradeshow has many blocks
            // and block has one tradeshow
            modelBuilder.Entity<Tradeshow>()
                .HasMany(ts => ts.RoomBlocks)
                .WithRequired(f => f.Tradeshow)
                .HasForeignKey(f => f.TradeshowID);

            // Tradeshow has one owner
            // and an owner can own many shows
            modelBuilder.Entity<Tradeshow>()
                .HasRequired(ts => ts.Owner)
                .WithMany(f => f.Tradeshows)
                .HasForeignKey(f => f.OwnerUsername);

            // Tradeshow has one Bcd that updated the tradeshow the last
            // and that Bcd can update many tradeshows
            modelBuilder.Entity<Tradeshow>()
                .HasRequired(t => t.LastBcdUpdated)
                .WithMany(u => u.TradeshowsUpdated)
                .HasForeignKey(f => f.LastBcdUpdatedUsername);

            // Attendee has many field values
            // and field value has one attendee
            modelBuilder.Entity<Attendee>()
                .HasMany(a => a.FieldValues)
                .WithRequired(v => v.Attendee)
                .HasForeignKey(v => v.AttendeeID);

            // Attendee has a user profile
            // and a user profile can be for many attendees
            modelBuilder.Entity<Attendee>()
                .HasRequired(a => a.User)
                .WithMany(u => u.Attendees)
                .HasForeignKey(a => a.Username);

            // Tradehow Field has many Attendee values
            // and Attendee value has one Tradeshow Field
            modelBuilder.Entity<TradeshowField>()
                .HasMany(tf => tf.AttendeeValues)
                .WithRequired(v => v.TradeshowField)
                .HasForeignKey(v => v.TradeshowFieldID);

            // Profile may have a delegate
            // and a delegate can have many profiles.
            modelBuilder.Entity<User>()
                .HasOptional(p => p.Delegate)
                .WithMany(d => d.Constituents)
                .HasForeignKey(d => d.DelegateUsername);

            // Tradeshow user has a user profile
            // and a user profile can be tied to many tradeshow users.
            modelBuilder.Entity<TradeshowUser>()
                .HasRequired(u => u.User)
                .WithMany(u => u.ShowTeams)
                .HasForeignKey(u => u.Username);
        }

        #region Encryption

        public override int SaveChanges()
        {
            if (string.IsNullOrWhiteSpace(this.EncryptionPwdHash))
            {
                return base.SaveChanges();
            }

            var contextAdapter = ((IObjectContextAdapter)this);

            contextAdapter.ObjectContext.DetectChanges(); // force this.

            var pendingEntities = contextAdapter.ObjectContext.ObjectStateManager
                .GetObjectStateEntries(EntityState.Added | EntityState.Modified)
                .Where(en => !en.IsRelationship)
                .ToList();

            // encrypt pending changes
            foreach (var entry in pendingEntities)
            {
                EncryptEntity(entry.Entity);
            }

            int result = base.SaveChanges();

            // decrypt updated changes
            foreach (var entry in pendingEntities)
            {
                DecryptEntity(entry.Entity);
            }

            return result;
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(this.EncryptionPwdHash))
            {
                return await base.SaveChangesAsync(cancellationToken);
            }

            var contextAdapter = ((IObjectContextAdapter)this);

            contextAdapter.ObjectContext.DetectChanges(); // force this.

            var pendingEntities = contextAdapter.ObjectContext.ObjectStateManager
                .GetObjectStateEntries(EntityState.Added | EntityState.Modified)
                .Where(en => !en.IsRelationship)
                .ToList();

            // encrypt pending changes
            foreach (var entry in pendingEntities)
            {
                EncryptEntity(entry.Entity);
            }

            int result = await base.SaveChangesAsync(cancellationToken);

            // decrypt updated changes
            foreach (var entry in pendingEntities)
            {
                DecryptEntity(entry.Entity);
            }

            return result;
        }

        private void ObjectContext_ObjectMaterialized(object sender, ObjectMaterializedEventArgs e)
        {
            DecryptEntity(e.Entity);
        }

        public void EncryptEntity(object entity)
        {
            if (string.IsNullOrWhiteSpace(this.EncryptionPwdHash))
            {
                return;
            }

            var properties = entity.GetType().GetProperties()
                .Where(p => p.GetCustomAttributes(typeof(Encrypted), true)
                    .Any(a => p.PropertyType == typeof(string) || p.PropertyType == typeof(byte[])));

            foreach (var property in properties)
            {
                if (property.PropertyType == typeof(string))
                { 
                    string value = property.GetValue(entity) as string;

                    if (!string.IsNullOrWhiteSpace(value))
                    {
                        string encryptedVal = Encrypt.EncryptString(value, this.EncryptionPwdHash);
                        property.SetValue(entity, encryptedVal);
                    }
                }
                else if (property.PropertyType == typeof(byte[]))
                {
                    byte[] value = property.GetValue(entity) as byte[];

                    if (value != null && value.Length > 0)
                    {
                        byte[] encrytedVal = Encrypt.EncryptByte(value, this.EncryptionPwdHash);
                        property.SetValue(entity, encrytedVal);
                    }

                }
            }
        }

        public void DecryptEntity(object entity)
        {
            if (string.IsNullOrWhiteSpace(this.EncryptionPwdHash))
            {
                return;
            }

            var properties = entity.GetType().GetProperties()
                .Where(p => p.GetCustomAttributes(typeof(Encrypted), true)
                    .Any(a => p.PropertyType == typeof(string) || p.PropertyType == typeof(byte[])));

            foreach (var property in properties)
            {
                if (property.PropertyType == typeof(string))
                {
                    string encryptedVal = property.GetValue(entity) as string;

                    if (!string.IsNullOrWhiteSpace(encryptedVal))
                    {
                        string value = Encrypt.DecryptString(encryptedVal, this.EncryptionPwdHash);
                        Entry(entity).Property(property.Name).OriginalValue = value;
                        Entry(entity).Property(property.Name).IsModified = false;
                    }
                }
                else if (property.PropertyType == typeof(byte[]))
                {
                    byte[] encrytedVal = property.GetValue(entity) as byte[];

                    if (encrytedVal != null && encrytedVal.Length > 0)
                    {
                        byte[] value = Encrypt.DecryptByte(encrytedVal, this.EncryptionPwdHash);
                        Entry(entity).Property(property.Name).OriginalValue = value;
                        Entry(entity).Property(property.Name).IsModified = false;
                    }
                }
            }
        }

        #endregion
    }
}
