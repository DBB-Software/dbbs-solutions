using Microsoft.AspNetCore.Mvc;

namespace DBBS.AspnetServer.Weather;

[ApiController]
[Route("weather-forecasts")]
public class WeatherForecastController(IWeatherService weatherService, ILogger<WeatherForecastController> logger)
{
    [HttpGet]
    public IEnumerable<WeatherForecast> GetForecasts()
    {
        logger.LogInformation("Getting weather forecast");
        return weatherService.GetForecasts();
    }
}
