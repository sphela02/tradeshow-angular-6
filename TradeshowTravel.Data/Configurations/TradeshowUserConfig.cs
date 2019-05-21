namespace TradeshowTravel.Data.Configurations
{
    using Models;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.ModelConfiguration;

    public class TradeshowUserConfig : EntityTypeConfiguration<TradeshowUser>
    {
        public TradeshowUserConfig()
        {
            ToTable("TradeshowUsers", "dbo");

            Property(p => p.ID)
                .HasDatabaseGeneratedOption(DatabaseGeneratedOption.Identity)
                .HasColumnOrder(0)
                .IsRequired();

            Property(p => p.TradeshowID)
                .HasColumnOrder(1)
                .IsRequired();

            Property(p => p.Username)
                .HasColumnOrder(2)
                .HasMaxLength(8)
                .IsUnicode(false)
                .IsRequired();

            Property(p => p.Role)
                .HasColumnOrder(3)
                .IsRequired();

            HasKey(k => k.ID);
        }
    }
}
