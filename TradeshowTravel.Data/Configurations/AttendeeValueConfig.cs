namespace TradeshowTravel.Data.Configurations
{
    using Models;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.ModelConfiguration;

    public class AttendeeValueConfig : EntityTypeConfiguration<AttendeeValue>
    {
        public AttendeeValueConfig()
        {
            ToTable("AttendeeValues", "dbo");

            Property(p => p.ID)
                .HasColumnOrder(0)
                .HasDatabaseGeneratedOption(DatabaseGeneratedOption.Identity)
                .IsRequired();

            Property(p => p.AttendeeID)
                .HasColumnOrder(1)
                .IsRequired();

            Property(p => p.TradeshowFieldID)
                .HasColumnOrder(2)
                .IsRequired();

            Property(p => p.Value)
                .HasColumnOrder(3)
                .IsMaxLength()
                .IsUnicode(false)
                .IsRequired();

            HasKey(k => new { k.ID });
        }
    }
}
