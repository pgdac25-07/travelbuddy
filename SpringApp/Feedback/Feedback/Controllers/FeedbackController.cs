using FeedbackService.Services;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class FeedbackController : ControllerBase
{
    private readonly IFeedbackService _service;

    public FeedbackController(IFeedbackService service)
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

    // Travel company views feedback
    [HttpGet("company/{companyId}")]
    public async Task<IActionResult> GetCompanyFeedback(int companyId)
    {
        var feedbacks = await _service.ViewCompanyFeedbackAsync(companyId);
        return Ok(feedbacks);
    }
}
