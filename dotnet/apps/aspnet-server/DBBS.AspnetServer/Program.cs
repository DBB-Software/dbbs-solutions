using DBBS.AspnetServer.Weather;
using DBBS.AspnetServer.WeatherHistory;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

// Register features and modules
builder.AddWeatherFeature();
builder.AddWeatherHistoryFeature();

builder.Services.AddSingleton(TimeProvider.System);
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();
app.UseAuthorization();
app.MapControllers();
app.Run();
