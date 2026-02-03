using FeedbackService.Repositories;

namespace FeedbackService.Services
{
    public class FeedbackService
    {
        private readonly IFeedbackRepository _repository;

        public FeedbackService(IFeedbackRepository repository)
        {
            _repository = repository;
        }

        public async Task SubmitFeedbackAsync(Feedback feedback)
        {
            feedback.CreatedAt = DateTime.Now;
            await _repository.AddFeedbackAsync(feedback);
        }

        public async Task<List<Feedback>> ViewCompanyFeedbackAsync(int companyId)
        {
            return await _repository.GetFeedbackByCompanyAsync(companyId);
        }
    }
}
