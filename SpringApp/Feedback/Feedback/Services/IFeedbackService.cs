namespace FeedbackService.Services
{
    public interface IFeedbackService
    {
        Task SubmitFeedbackAsync(Feedback feedback);
        Task<List<Feedback>> ViewCompanyFeedbackAsync(int companyId);
    }
}
