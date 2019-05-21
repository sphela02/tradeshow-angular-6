namespace TradeshowTravel.ECA.Configurations
{
    using Models;
    using System.Data.Entity.ModelConfiguration;

    public class AssociateConfig : EntityTypeConfiguration<Associate>
    {
        public AssociateConfig()
        {
            ToTable("ASSOCIATE_T", "ECA");

            // Properties
            Property(p => p.ID)
                .HasColumnOrder(0)
                .HasColumnName("ASSOC_ID")
                .HasMaxLength(11)
                .IsUnicode(false)
                .IsRequired();

            Property(p => p.Username)
                .HasColumnOrder(1)
                .HasColumnName("ECA_ID")
                .HasMaxLength(8)
                .IsUnicode(false)
                .IsRequired();

            Property(p => p.EmplID)
                .HasColumnOrder(2)
                .HasColumnName("NEW_EMPLID")
                .HasMaxLength(11)
                .IsUnicode(false)
                .IsOptional();

            Property(p => p.First)
                .HasColumnOrder(3)
                .HasColumnName("FIRST_NM")
                .HasMaxLength(30)
                .IsUnicode(false)
                .IsOptional();

            Property(p => p.Last)
                .HasColumnOrder(4)
                .HasColumnName("LAST_NM")
                .HasMaxLength(30)
                .IsUnicode(false)
                .IsOptional();

            Property(p => p.PreferredFirst)
                .HasColumnOrder(5)
                .HasColumnName("PREF_FIRST_NM")
                .HasMaxLength(30)
                .IsUnicode(false)
                .IsOptional();

            Property(p => p.PreferredLast)
                .HasColumnOrder(6)
                .HasColumnName("PREF_LAST_NM")
                .HasMaxLength(30)
                .IsUnicode(false)
                .IsOptional();

            Property(p => p.PreferredEmail)
                .HasColumnOrder(7)
                .HasColumnName("ASSOC_PREF_EMAIL_ID")
                .HasMaxLength(80)
                .IsUnicode(false)
                .IsOptional();

            Property(p => p.Title)
                .HasColumnOrder(8)
                .HasColumnName("ASSOC_BUS_TITLE_TX")
                .HasMaxLength(30)
                .IsUnicode(false)
                .IsOptional();

            Property(p => p.Telephone)
                .HasColumnOrder(9)
                .HasColumnName("ASSOC_OFC_PH_NR")
                .HasMaxLength(24)
                .IsUnicode(false)
                .IsOptional();

            Property(p => p.Mobile)
                .HasColumnOrder(10)
                .HasColumnName("ASSOC_BUS_CLLR_NR")
                .HasMaxLength(24)
                .IsUnicode(false)
                .IsOptional();

            Property(p => p.Class)
                .HasColumnOrder(11)
                .HasColumnName("ASSOC_CLASS_CD")
                .HasMaxLength(10)
                .IsUnicode(false)
                .IsRequired();

            Property(p => p.Status)
                .HasColumnOrder(12)
                .HasColumnName("ASSOC_STATUS_CD")
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsRequired();

            Property(p => p.SupervisorID)
                .HasColumnOrder(13)
                .HasColumnName("ASSOC_MANAGER_ID")
                .HasMaxLength(11)
                .IsUnicode(false)
                .IsOptional();

            Property(p => p.Segment)
                .HasColumnOrder(14)
                .HasColumnName("SEGMENT")
                .HasMaxLength(5)
                .IsUnicode(false)
                .IsOptional();

            Property(p => p.Company)
                .HasColumnOrder(15)
                .HasColumnName("COMPANY_NM")
                .HasMaxLength(30)
                .IsUnicode(false)
                .IsOptional();
            
            Property(p => p.ShowPictureFlag)
                .HasColumnOrder(16)
                .HasColumnName("SHOW_PICTURE_FLAG")
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsOptional();

            Ignore(p => p.FirstName);
            Ignore(p => p.LastName);
            Ignore(p => p.Email);
            Ignore(p => p.ShowPicture);

            HasKey(k => k.ID);
        }
    }
}
