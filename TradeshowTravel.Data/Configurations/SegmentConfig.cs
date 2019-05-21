namespace TradeshowTravel.Data.Configurations
{
    using Models;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.ModelConfiguration;

    public class SegmentConfig : EntityTypeConfiguration<Segment>
    {
        public SegmentConfig()
        {
            ToTable("Segments", "dbo");

            Property(p => p.ID)
                .HasColumnOrder(0)
                .HasDatabaseGeneratedOption(DatabaseGeneratedOption.Identity)
                .IsRequired();

            Property(p => p.Name)
                .HasColumnOrder(1)
                .HasMaxLength(50)
                .IsUnicode(false)
                .IsRequired();

            HasKey(k => k.ID);
        }
    }
}
