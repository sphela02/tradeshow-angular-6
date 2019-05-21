namespace TradeshowTravel.Data.Configurations
{
    using Models;
    using System.Data.Entity.ModelConfiguration;
    using Domain.DTOs;

    public class UserImageConfig : EntityTypeConfiguration<UserImages>
    {
        public UserImageConfig()
        {
            ToTable("UserImages", "dbo");

            Property(p => p.Username)
                .HasColumnOrder(0)
                .HasMaxLength(8)
                .IsUnicode(false)
                .IsRequired();

            Property(p => p.Image)
                .HasColumnOrder(1)
                .IsRequired();

            Property(p => p.ImageType)
                .HasColumnOrder(2)
                .IsRequired();

            Property(p => p.Category)
                .HasColumnOrder(3)
                .HasMaxLength(50)
                .IsRequired();

            Property(p => p.Description)
                .HasColumnOrder(4)
                .HasMaxLength(500)
                .IsOptional();

            HasKey(k => new { k.Username, k.Category });
        }
    }
}