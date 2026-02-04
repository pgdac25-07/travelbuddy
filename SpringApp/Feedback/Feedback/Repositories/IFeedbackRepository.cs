using FeedbackService.Models;

namespace FeedbackService.Repositories
{
    public interface IFeedbackRepository
    {
        Task AddFeedbackAsync(Feedback feedback);
        Task<List<Feedback>> GetFeedbackByBookingAsync(int bookingId);
        Task<List<Feedback>> GetFeedbackByCustomerAsync(int customerId);
        Task<List<Feedback>> GetAllFeedbackAsync();
    }
}
