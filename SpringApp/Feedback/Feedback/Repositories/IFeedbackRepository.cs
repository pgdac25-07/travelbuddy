namespace FeedbackService.Repositories
{
    public interface IFeedbackRepository
    {
        Task AddFeedbackAsync(Feedback feedback);
        Task<List<Feedback>> GetFeedbackByCompanyAsync(int companyId);
    }
}
