namespace TradeshowTravel.Data.Configurations
{
    using Models;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.ModelConfiguration;

    public class DefaultFieldConfig : EntityTypeConfiguration<DefaultField>
    {
        public DefaultFieldConfig()
        {
            ToTable("Fields", "dbo");

            Property(p => p.ID)
                .HasColumnOrder(0)
                .HasDatabaseGeneratedOption(DatabaseGeneratedOption.Identity)
                .IsRequired();

            Property(p => p.Label)
                .HasColumnOrder(1)
                .HasMaxLength(256)
                .IsUnicode(false)
                .IsRequired();

            Property(p => p.Input)
                .HasColumnOrder(2)
                .HasMaxLength(50)
                .IsUnicode(false)
                .IsRequired();

            Property(p => p.Source)
                .HasColumnOrder(3)
                .HasMaxLength(50)
                .IsUnicode(false)
                .IsOptional();

            Property(p => p.Tooltip)
                .HasColumnOrder(4)
                .HasMaxLength(256)
                .IsUnicode(false)
                .IsOptional();

            Property(p => p.Options)
                .HasColumnOrder(5)
                .HasMaxLength(256)
                .IsUnicode(false)
                .IsOptional();

            Property(p => p.Format)
                .HasColumnOrder(6)
                .HasMaxLength(25)
                .IsUnicode(false)
                .IsOptional();

            Property(p => p.Order)
                .HasColumnOrder(7)
                .IsRequired();

            Property(p => p.Required)
                .HasColumnOrder(8)
                .IsRequired();

            Property(p => p.Included)
                .HasColumnOrder(9)
                .IsRequired();

            Property(p => p.Access)
                .HasColumnOrder(10)
                .IsRequired();

            HasKey(k => k.ID);
        }
    }
}
