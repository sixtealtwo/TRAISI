using System.Threading.Tasks;

namespace TRAISI.Data.Repositories.Interfaces
{
    public interface IApplicationDbContext
    {
        int SaveChanges();
      
        Task<int> SaveChangesAsync();
        
    }
}