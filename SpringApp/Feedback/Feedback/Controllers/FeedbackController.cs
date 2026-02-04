using FeedbackService.Models;
using FeedbackService.Services;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class FeedbackController : ControllerBase
{
    private readonly IFeedbackServiceA _service;

    public FeedbackController(IFeedbackServiceA service)
    {
        _service = service;
    }

    // Traveler sends feedback
    [HttpPost("send")]
    public async Task<IActionResult> SendFeedback([FromBody] Feedback feedback)
    {
        await _service.SubmitFeedbackAsync(feedback);
        return Ok(new { message = "Feedback submitted successfully" });
    }

    // View feedback by booking
    [HttpGet("booking/{bookingId}")]
    public async Task<IActionResult> GetFeedbackByBooking(int bookingId)
    {
        var feedbacks = await _service.ViewFeedbackByBookingAsync(bookingId);
        return Ok(feedbacks);
    }
}
