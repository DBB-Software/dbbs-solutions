namespace DBBS.AspnetServer.Weather;

public static class FeatureRegistration
{
    public static void AddWeatherFeature(this IHostApplicationBuilder host) => host.Services
        .AddScoped<IWeatherService, WeatherService>()
        .Configure<WeatherConfig>(host.Configuration.GetSection("Weather"));
}
