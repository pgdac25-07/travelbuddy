namespace FeedbackService.Models
{
    public class Feedback
    {
        public int FeedbackId { get; set; }
        public int CustomerId { get; set; }
        public int CompanyId { get; set; }
        public int Rating { get; set; }
        public string? Comment { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
