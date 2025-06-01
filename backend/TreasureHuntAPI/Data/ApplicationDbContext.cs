using Microsoft.EntityFrameworkCore;
using TreasureHuntAPI.Models;

namespace TreasureHuntAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }
        public DbSet<TreasureMap> TreasureMaps { get; set; }
    }

}
