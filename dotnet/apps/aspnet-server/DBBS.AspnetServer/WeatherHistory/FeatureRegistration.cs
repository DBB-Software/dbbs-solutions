using Microsoft.EntityFrameworkCore;

namespace DBBS.AspnetServer.WeatherHistory;

public static class FeatureRegistration
{
    public static void AddWeatherHistoryFeature(this IHostApplicationBuilder host) => host.Services
        .AddDbContext<WeatherDbContext>(opt => opt.UseSqlite(host.Configuration.GetConnectionString("WeatherDatabase")))
        .AddScoped<IWeatherHistoryService, WeatherHistoryService>();
}
