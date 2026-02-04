using FeedbackService.Models;

namespace FeedbackService.Services
{
    public interface IFeedbackServiceA
    {
        Task SubmitFeedbackAsync(Feedback feedback);
        Task<List<Feedback>> ViewFeedbackByBookingAsync(int bookingId);
    }
}
