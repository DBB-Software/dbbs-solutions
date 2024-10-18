using Microsoft.EntityFrameworkCore;

namespace DBBS.AspnetServer.WeatherHistory;

public interface IWeatherHistoryService
{
    Task LogHistory(int temperatureC, string? summary);
    Task<IReadOnlyList<WeatherLogDto>> GetRecentHistory(int take);
}

public record WeatherLogDto(DateTimeOffset TimeStamp, int TemperatureC, string? Summary);

public class WeatherHistoryService(
    WeatherDbContext dbContext,
    ILogger<WeatherHistoryService> logger,
    TimeProvider time) : IWeatherHistoryService
{
    public async Task LogHistory(int temperatureC, string? summary)
    {
        dbContext.WeatherLogs.Add(new WeatherLogEntity
        {
            TimeStamp = time.GetUtcNow(),
            TemperatureC = temperatureC,
            Summary = summary
        });
        await dbContext.SaveChangesAsync();
        logger.LogInformation("Weather history added");
    }

    public async Task<IReadOnlyList<WeatherLogDto>> GetRecentHistory(int take)
    {
        return (await dbContext.WeatherLogs
                .OrderByDescending(e => e.Id)
                .Take(take)
                .Select(e => new WeatherLogDto(e.TimeStamp, e.TemperatureC, e.Summary))
                .ToListAsync())
            .ToImmutableList();
    }
}
