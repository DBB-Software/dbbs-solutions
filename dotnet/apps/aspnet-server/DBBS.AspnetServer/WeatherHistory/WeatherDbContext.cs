using Microsoft.EntityFrameworkCore;

namespace DBBS.AspnetServer.WeatherHistory;

public class WeatherLogEntity
{
    public int Id { get; init; }
    public DateTimeOffset TimeStamp { get; init; }
    public int TemperatureC { get; init; }
    public string? Summary { get; init; }
}

public class WeatherDbContext(DbContextOptions<WeatherDbContext> options) : DbContext(options)
{
    public DbSet<WeatherLogEntity> WeatherLogs { get; init; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<WeatherLogEntity>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.TimeStamp).IsRequired();
            entity.Property(e => e.TemperatureC).IsRequired();
            entity.Property(e => e.Summary).HasMaxLength(250);
        });
    }
}
