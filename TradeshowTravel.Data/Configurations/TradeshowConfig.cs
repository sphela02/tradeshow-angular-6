namespace TradeshowTravel.Data.Configurations
{
    using Models;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.ModelConfiguration;

    public class TradeshowConfig : EntityTypeConfiguration<Tradeshow>
    {
        public TradeshowConfig()
        {
            ToTable("Tradeshows", "dbo");

            Property(p => p.ID)
                .HasColumnOrder(0)
                .HasDatabaseGeneratedOption(DatabaseGeneratedOption.Identity)
                .IsRequired();

            Property(p => p.Name)
                .HasColumnOrder(1)
                .HasMaxLength(256)
                .IsUnicode(false)
                .IsRequired();

            Property(p => p.Description)
                .HasColumnOrder(2)
                .IsMaxLength()
                .IsUnicode(false)
                .IsOptional();

            Property(p => p.Venue)
                .HasColumnOrder(3)
                .HasMaxLength(256)
                .IsUnicode(false)
                .IsOptional();

            Property(p => p.Location)
                .HasColumnOrder(4)
                .HasMaxLength(256)
                .IsUnicode(false)
                .IsOptional();

            Property(p => p.StartDate)
                .HasColumnOrder(5)
                .IsOptional();

            Property(p => p.EndDate)
                .HasColumnOrder(6)
                .IsOptional();

            Property(p => p.Segments)
                .HasColumnOrder(7)
                .HasMaxLength(50)
                .IsUnicode(false)
                .IsOptional();

            Property(p => p.Tier)
                .HasColumnOrder(8)
                .HasMaxLength(50)
                .IsUnicode(false)
                .IsOptional();

            Property(p => p.ShowType)
                .HasColumnOrder(9)
                .HasMaxLength(50)
                .IsUnicode(false)
                .IsRequired();

            Property(p => p.RosterDueDate)
                .HasColumnOrder(10)
                .IsOptional();

            Property(p => p.RsvpDueDate)
                .HasColumnOrder(11)
                .IsOptional();

            Property(p => p.Hotels)
                .HasColumnOrder(12)
                .IsMaxLength()
                .IsUnicode(false)
                .IsOptional();

            Property(p => p.EstAttendeeCount)
                .HasColumnOrder(13)
                .IsOptional();

            Property(p => p.OwnerUsername)
                .HasColumnOrder(14)
                .HasMaxLength(8)
                .IsUnicode(false)
                .IsRequired();

            Property(p => p.CreatedDate)
                .HasColumnOrder(15)
                .IsRequired();

            Property(p => p.SendReminders)
                .HasColumnOrder(16)
                .IsRequired();

            Property(p => p.Archived)
                .HasColumnOrder(17)
                .IsRequired();

            Property(p => p.LastBcdUpdatedUsername)
               .HasColumnOrder(18)
               .IsOptional();

            Property(p => p.LastBcdUpdatedDateTime)
               .HasColumnOrder(19)
               .IsOptional();

            HasKey(k => k.ID);
        }
    }
}
