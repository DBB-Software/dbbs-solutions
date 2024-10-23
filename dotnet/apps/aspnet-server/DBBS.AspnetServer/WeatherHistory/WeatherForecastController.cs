using Microsoft.AspNetCore.Mvc;

namespace DBBS.AspnetServer.WeatherHistory;

[ApiController]
[Route("weather-history")]
public class WeatherHistoryController(
    IWeatherHistoryService weatherHistoryService,
    ILogger<WeatherHistoryController> logger)
{
    public record LogHistoryRequest(int TemperatureC, string? Summary);

    [HttpPost]
    public async Task LogHistory([FromBody] LogHistoryRequest request)
    {
        logger.LogInformation("Log weather history");
        await weatherHistoryService.LogHistory(request.TemperatureC, request.Summary);
    }

    [HttpGet]
    public async Task<IEnumerable<WeatherLogDto>> GetRecentHistory(int take = 10)
    {
        logger.LogInformation("Getting weather history");
        return await weatherHistoryService.GetRecentHistory(take);
    }
}
