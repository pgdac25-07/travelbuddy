using FeedbackService.Models;
using FeedbackService.Repositories;

namespace FeedbackService.Services
{
    public class FeedbackServiceA : IFeedbackServiceA
    {
        private readonly IFeedbackRepository _repository;

        public FeedbackServiceA(IFeedbackRepository repository)
        {
            _repository = repository;
        }

        public async Task SubmitFeedbackAsync(Feedback feedback)
        {
            feedback.CreatedAt = DateTime.Now;
            await _repository.AddFeedbackAsync(feedback);
        }

        public async Task<List<Feedback>> ViewFeedbackByBookingAsync(int bookingId)
        {
            return await _repository.GetFeedbackByBookingAsync(bookingId);
        }


        public async Task<List<Feedback>> ViewFeedbackByCustomerAsync(int customerId)
        {
            return await _repository.GetFeedbackByCustomerAsync(customerId);
        }

        public async Task<List<Feedback>> ViewAllFeedbackAsync()
        {
            return await _repository.GetAllFeedbackAsync();
        }

    }
}
