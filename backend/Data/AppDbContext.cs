using Microsoft.EntityFrameworkCore;
using BACKEND.Models;

namespace BACKEND.Data   // ✅ Important: This must match your namespace
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<MiniItem> MiniItems { get; set; }
    }
}
