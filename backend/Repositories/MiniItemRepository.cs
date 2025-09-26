using BACKEND.Data;   // 
using BACKEND.Models;
using Microsoft.EntityFrameworkCore;

namespace BACKEND.Repositories
{
    public class MiniItemRepository : IMiniRepository
    {
        private readonly AppDbContext _context;

        public MiniItemRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<MiniItem>> GetAllAsync()
        {
            return await _context.MiniItems.ToListAsync();
        }

        public async Task<MiniItem?> GetByIdAsync(int id)
        {
            return await _context.MiniItems.FindAsync(id);
        }

        public async Task AddAsync(MiniItem item)
        {
            _context.MiniItems.Add(item);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(MiniItem item)
        {
            _context.MiniItems.Update(item);
            await _context.SaveChangesAsync();
        }
        public async Task MarkAsBoughtAsync(int id)
        {
            var item = await _context.MiniItems.FindAsync(id);
            if (item != null)
            {
                item.Status = "Bought";  // or item.IsBought = true;
                await _context.SaveChangesAsync();
            }
        }

        public async Task DeleteAsync(int id)
        {
            var item = await _context.MiniItems.FindAsync(id);
            if (item != null)
            {
                _context.MiniItems.Remove(item);
                await _context.SaveChangesAsync();
            }
        }
    }
}
