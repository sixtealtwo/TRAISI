using System.Threading.Tasks;

namespace DAL.Repositories.Interfaces
{
    public interface IApplicationDbContext
    {
        int SaveChanges();
      
        Task<int> SaveChangesAsync();
        
    }
}