using DBBS.AspnetServer.WeatherHistory;
using Microsoft.EntityFrameworkCore;

namespace DBBS.AspnetServer.Tests.WeatherHistory;

public class WeatherHistoryServiceTests
{
    [Fact]
    public async Task GetRecentHistory()
    {
        // Given
        await using var dbContext = new WeatherDbContext(UseInMemoryDb());
        dbContext.WeatherLogs.AddRange(
            new WeatherLogEntity
            {
                TimeStamp = new DateTime(2024, 08, 01),
                Summary = "Sunny"
            },
            new WeatherLogEntity
            {
                TimeStamp = new DateTime(2024, 10, 01),
                Summary = "Rainy"
            }
        );
        await dbContext.SaveChangesAsync();
        var logger = Substitute.For<ILogger<WeatherHistoryService>>();
        var time = Substitute.For<TimeProvider>();
        var service = new WeatherHistoryService(dbContext, logger, time);

        // When
        var actual = await service.GetRecentHistory(take: 1);

        // Then
        actual.Should().HaveCount(1);
        actual.First().Summary.Should().Be("Rainy");
    }

    private static DbContextOptions<WeatherDbContext> UseInMemoryDb() => new DbContextOptionsBuilder<WeatherDbContext>()
        .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
        .Options;
}
