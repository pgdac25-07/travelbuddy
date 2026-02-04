using FeedbackService.Models;

namespace FeedbackService.Services
{
    public interface IFeedbackServiceA
    {
        Task SubmitFeedbackAsync(Feedback feedback);
        Task<List<Feedback>> ViewFeedbackByBookingAsync(int bookingId);
        Task<List<Feedback>> ViewFeedbackByCustomerAsync(int customerId);
        Task<List<Feedback>> ViewAllFeedbackAsync();
    }
}
