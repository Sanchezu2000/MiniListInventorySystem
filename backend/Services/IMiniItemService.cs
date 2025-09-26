using BACKEND.Models;

namespace BACKEND.Services
{
    public interface IMiniItemService
    {
        Task<IEnumerable<MiniItem>> GetAllAsync();
        Task<MiniItem?> GetByIdAsync(int id);
        Task<MiniItem> AddAsync(MiniItem item);
        Task<MiniItem?> UpdateAsync(MiniItem item);
        Task<bool> DeleteAsync(int id);
    }
}
