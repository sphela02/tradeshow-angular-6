namespace TradeshowTravel.Data.Configurations
{
    using Models;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.ModelConfiguration;

    public class AttendeeConfig : EntityTypeConfiguration<Attendee>
    {
        public AttendeeConfig()
        {
            ToTable("Attendees", "dbo");

            Property(p => p.ID)
                .HasColumnOrder(0)
                .HasDatabaseGeneratedOption(DatabaseGeneratedOption.Identity)
                .IsRequired();

            Property(p => p.TradeshowID)
                .HasColumnOrder(1)
                .IsRequired();

            Property(p => p.Username)
                .HasColumnOrder(2)
                .HasMaxLength(8)
                .IsUnicode(false)
                .IsRequired();

            Property(p => p.Status)
                .HasColumnOrder(3)
                .HasMaxLength(10)
                .IsUnicode(false)
                .IsOptional();

            Property(p => p.Arrival)
                .HasColumnOrder(4)
                .IsOptional();

            Property(p => p.Departure)
                .HasColumnOrder(5)
                .IsOptional();

            Property(p => p.TravelMethod)
                .HasColumnOrder(6)
                .HasMaxLength(50)
                .IsUnicode(false)
                .IsOptional();

            Property(p => p.CCNumber)
                .HasColumnOrder(7)
                .IsMaxLength()
                .IsUnicode(false)
                .IsOptional();

            Property(p => p.CCExpiration)
                .HasColumnOrder(8)
                .IsMaxLength()
                .IsUnicode(false)
                .IsOptional();

            Property(p => p.CVVNumber)
                .HasColumnOrder(9)
                .IsMaxLength()
                .IsUnicode(false)
                .IsOptional();

            Property(p => p.IsHotelNeeded)
                .HasColumnOrder(10)
                .IsOptional();

            Property(p => p.SendRSVP)
                .HasColumnOrder(11)
                .IsRequired();

            Property(p => p.DateCreated)
                .HasColumnOrder(12)
                .IsRequired();

            Property(p => p.DateAccepted)
                .HasColumnOrder(13)
                .IsOptional();

            Property(p => p.DateCancelled)
                .HasColumnOrder(14)
                .IsOptional();

            Property(p => p.DateCompleted)
                .HasColumnOrder(15)
                .IsOptional();

            HasKey(k => k.ID);
        }
    }
}
