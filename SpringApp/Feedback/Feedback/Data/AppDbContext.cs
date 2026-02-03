using FeedbackService.Models;
using Microsoft.EntityFrameworkCore;


namespace FeedbackService.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Feedback> Feedbacks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Feedback>(entity =>
            {
                entity.ToTable("feedback");

                entity.HasKey(e => e.FeedbackId);

                entity.Property(e => e.FeedbackId)
                      .HasColumnName("feedback_id");

                entity.Property(e => e.CustomerId)
                      .HasColumnName("customer_id");

                entity.Property(e => e.CompanyId)
                      .HasColumnName("company_id");

                entity.Property(e => e.Rating)
                      .HasColumnName("rating");

                entity.Property(e => e.Comment)
                      .HasColumnName("comment");

                entity.Property(e => e.CreatedAt)
                      .HasColumnName("created_at");
            });
        }
    }
}
