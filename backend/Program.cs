using BACKEND.Data;
using BACKEND.Repositories;
using BACKEND.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// --------------------
// Register Services
// --------------------

// DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register Repository
builder.Services.AddScoped<IMiniRepository, MiniItemRepository>();

// Register Service (if needed)
builder.Services.AddScoped<IMiniItemService, MiniItemService>();

// Controllers
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure CORS BEFORE Build
builder.Services.AddCors(opt =>
{
    opt.AddPolicy("DevCors", p =>
        p.WithOrigins("http://localhost:5173", "http://localhost:5143")
         .AllowAnyHeader()
         .AllowAnyMethod()
    );
});

// --------------------
// Build the app
// --------------------
var app = builder.Build();

// --------------------
// Middleware
// --------------------
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Enable CORS
app.UseCors("DevCors");

app.UseAuthorization();
app.MapControllers();

app.Run();
