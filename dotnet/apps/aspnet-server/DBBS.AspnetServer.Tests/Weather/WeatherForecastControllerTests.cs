using DBBS.AspnetServer.Weather;

namespace DBBS.AspnetServer.Tests.Weather;

public class WeatherForecastControllerTests
{
    [Fact]
    public void Get()
    {
        // Given
        ImmutableArray<WeatherForecast> forecast = [new(new DateOnly(), 1, "test")];
        var service = Substitute.For<IWeatherService>();
        service.GetForecasts().Returns(forecast);
        var logger = Substitute.For<ILogger<WeatherForecastController>>();
        var controller = new WeatherForecastController(service, logger);

        // When
        var actual = controller.GetForecasts();

        // Then
        actual.Should().BeEquivalentTo(forecast);
    }
}
