using FeedbackService.Data;
using FeedbackService.Models;
using Microsoft.EntityFrameworkCore;
namespace FeedbackService.Repositories
{
    public class FeedbackRepository : IFeedbackRepository
    {
        private readonly AppDbContext _context;

        public FeedbackRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddFeedbackAsync(Feedback feedback)
        {
            _context.Feedbacks.Add(feedback);
            await _context.SaveChangesAsync();
        }

        public async Task<List<Feedback>> GetFeedbackByBookingAsync(int bookingId)
        {
            return await _context.Feedbacks
                .Where(f => f.BookingId == bookingId)
                .ToListAsync();
        }

    }

}

