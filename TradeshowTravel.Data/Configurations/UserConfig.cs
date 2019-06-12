namespace TradeshowTravel.Data.Configurations
{
    using Models;
    using System.Data.Entity.ModelConfiguration;

    public class UserConfig : EntityTypeConfiguration<User>
    {
        public UserConfig()
        {
            ToTable("Users", "dbo");

            Property(p => p.Username)
                .HasColumnOrder(0)
                .HasMaxLength(8)
                .IsUnicode(false)
                .IsRequired();

            Property(p => p.DelegateUsername)
                .HasColumnOrder(1)
                .HasMaxLength(8)
                .IsUnicode(false)
                .IsOptional();

            Property(p => p.EmplID)
                .HasColumnOrder(2)
                .HasMaxLength(11)
                .IsUnicode(false)
                .IsOptional();

            Property(p => p.FirstName)
                .HasColumnOrder(3)
                .HasMaxLength(50)
                .IsUnicode(false)
                .IsRequired();

            Property(p => p.LastName)
                .HasColumnOrder(4)
                .HasMaxLength(50)
                .IsUnicode(false)
                .IsRequired();

            Property(p => p.Email)
                .HasColumnOrder(5)
                .HasMaxLength(256)
                .IsUnicode(false)
                .IsRequired();

            Property(p => p.Segment)
                .HasColumnOrder(6)
                .HasMaxLength(30)
                .IsUnicode(false)
                .IsOptional();

            Property(p => p.Title)
                .HasColumnOrder(7)
                .HasMaxLength(100)
                .IsUnicode(false)
                .IsOptional();

            Property(p => p.Mobile)
                .HasColumnOrder(8)
                .HasMaxLength(24)
                .IsUnicode(false)
                .IsOptional();

            Property(p => p.Telephone)
                .HasColumnOrder(9)
                .HasMaxLength(24)
                .IsUnicode(false)
                .IsOptional();

            Property(p => p.BadgeName)
                .HasColumnOrder(10)
                .HasMaxLength(100)
                .IsUnicode(false)
                .IsOptional();

            Property(p => p.PassportNumber)
                .HasColumnOrder(11)
                .IsMaxLength()
                .IsUnicode(false)
                .IsOptional();

            Property(p => p.PassportName)
                .HasColumnOrder(12)
                .IsMaxLength()
                .IsUnicode(false)
                .IsOptional();

            Property(p => p.PassportExpirationDate)
                .HasColumnOrder(19)
                .IsMaxLength()
                .IsUnicode(false)
                .IsOptional();

            Property(p => p.DOB)
                .HasColumnOrder(13)
                .IsMaxLength()
                .IsUnicode(false)
                .IsOptional();

            Property(p => p.Nationality)
                .HasColumnOrder(14)
                .IsMaxLength()
                .IsUnicode(false)
                .IsOptional();

            Property(p => p.COB)
                .HasColumnOrder(15)
                .IsMaxLength()
                .IsUnicode(false)
                .IsOptional();

            Property(p => p.COR)
                .HasColumnOrder(16)
                .IsMaxLength()
                .IsUnicode(false)
                .IsOptional();

            Property(p => p.COI)
                .HasColumnOrder(17)
                .IsMaxLength()
                .IsUnicode(false)
                .IsOptional();

            Property(p => p.Privileges)
                .HasColumnOrder(18)
                .IsRequired();

            HasKey(k => k.Username);
        }
    }
}
