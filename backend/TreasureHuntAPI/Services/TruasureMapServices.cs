using TreasureHuntAPI.Data;

namespace TreasureHuntAPI.Services
{
    public class TruasureMapServices
    {
        public ApplicationDbContext DbContext { get; }
        public ILogger<TruasureMapServices> Logger { get; }

        public TruasureMapServices(ILogger<TruasureMapServices> logger, ApplicationDbContext dbContext)
        {
            Logger = logger;
            DbContext = dbContext;
        }
    }
}
