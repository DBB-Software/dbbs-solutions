namespace DBBS.AspnetServer.Weather;

public interface IWeatherService
{
    IReadOnlyList<WeatherForecast> GetForecasts();
}

public record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}

public class WeatherService(IOptions<WeatherConfig> config) : IWeatherService
{
    public IReadOnlyList<WeatherForecast> GetForecasts() => Enumerable
        .Range(1, 5)
        .Select(index => new WeatherForecast(
            Date: DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            TemperatureC: Random.Shared.Next(-20, 55),
            Summary: config.Value.Conditions[Random.Shared.Next(config.Value.Conditions.Count)]
        ))
        .ToImmutableArray();
}
