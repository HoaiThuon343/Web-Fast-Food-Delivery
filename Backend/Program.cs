using API;
using MongoDB.Driver;
var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

var startup = new Startup(builder.Configuration);
startup.ConfigureServices(builder.Services);

var app = builder.Build();
startup.Configure(app, builder.Environment);


app.Run();