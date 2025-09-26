using System.Collections.Generic;
using System.Threading.Tasks;
using BACKEND.Models;

namespace BACKEND.Repositories
{
    public interface IMiniRepository
    {
        Task<IEnumerable<MiniItem>> GetAllAsync();
        Task<MiniItem?> GetByIdAsync(int id);
        Task AddAsync(MiniItem item);
        Task MarkAsBoughtAsync(int id);
        Task UpdateAsync(MiniItem item);
        Task DeleteAsync(int id);
    }
}
