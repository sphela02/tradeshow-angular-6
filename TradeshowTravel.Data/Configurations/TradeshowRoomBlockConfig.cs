using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TradeshowTravel.Data.Configurations
{
    using Models;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.ModelConfiguration;

    public class TradeshowRoomBlockConfig : EntityTypeConfiguration<TradeshowRoomBlock>
    {
        public TradeshowRoomBlockConfig()
        {
            ToTable("TradeshowRoomBlocks", "dbo");

            Property(p => p.ID)
                .HasColumnOrder(0)
                .HasDatabaseGeneratedOption(DatabaseGeneratedOption.Identity)
                .IsRequired();

            Property(p => p.TradeshowID)
                .HasColumnOrder(1)
                .IsRequired();

            Property(p => p.Date)
                .HasColumnOrder(2)
                .IsRequired();

            Property(p => p.EstRoomCount)
                .HasColumnOrder(3)
                .IsRequired();

            HasKey(k => k.ID);
        }
    }
}
