namespace TradeshowTravel.Data.Configurations
{
    using Models;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.ModelConfiguration;

    public class TradeshowFieldConfig : EntityTypeConfiguration<TradeshowField>
    {
        public TradeshowFieldConfig()
        {
            ToTable("TradeshowFields", "dbo");

            Property(p => p.ID)
                .HasColumnOrder(0)
                .HasDatabaseGeneratedOption(DatabaseGeneratedOption.Identity)
                .IsRequired();

            Property(p => p.TradeshowID)
                .HasColumnOrder(1)
                .IsRequired();

            Property(p => p.Label)
                .HasColumnOrder(2)
                .HasMaxLength(256)
                .IsUnicode(false)
                .IsRequired();

            Property(p => p.Input)
                .HasColumnOrder(3)
                .HasMaxLength(50)
                .IsUnicode(false)
                .IsRequired();

            Property(p => p.Source)
                .HasColumnOrder(4)
                .HasMaxLength(50)
                .IsUnicode(false)
                .IsOptional();

            Property(p => p.Tooltip)
                .HasColumnOrder(5)
                .HasMaxLength(256)
                .IsUnicode(false)
                .IsOptional();

            Property(p => p.Options)
                .HasColumnOrder(6)
                .HasMaxLength(256)
                .IsUnicode(false)
                .IsOptional();

            Property(p => p.Format)
                .HasColumnOrder(7)
                .HasMaxLength(25)
                .IsUnicode(false)
                .IsOptional();

            Property(p => p.Order)
                .HasColumnOrder(8)
                .IsRequired();

            Property(p => p.Required)
                .HasColumnOrder(9)
                .IsRequired();

            Property(p => p.Included)
                .HasColumnOrder(10)
                .IsRequired();

            Property(p => p.Access)
                .HasColumnOrder(11)
                .IsRequired();

            HasKey(k => new { k.ID });
        }
    }
}
