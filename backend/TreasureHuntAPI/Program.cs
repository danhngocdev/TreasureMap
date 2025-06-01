using Microsoft.EntityFrameworkCore;
using TreasureHuntAPI.Apis;
using TreasureHuntAPI.Data;
using TreasureHuntAPI.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddScoped<TruasureMapServices>();
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseInMemoryDatabase("TreasureDb"));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});


var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseCors("AllowReactApp");

app.UseHttpsRedirection();


app.MapTreasureMapApi();

app.Run();

