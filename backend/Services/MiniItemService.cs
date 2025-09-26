using BACKEND.Data;
using BACKEND.Models;
using Microsoft.EntityFrameworkCore;

namespace BACKEND.Services
{
    public class MiniItemService : IMiniItemService
    {
        private readonly AppDbContext _context;

        public MiniItemService(AppDbContext context)
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

        public async Task<MiniItem> AddAsync(MiniItem item)
        {
            _context.MiniItems.Add(item);
            await _context.SaveChangesAsync();
            return item;
        }

        public async Task<MiniItem?> UpdateAsync(MiniItem item)
        {
            var existing = await _context.MiniItems.FindAsync(item.Id);
            if (existing == null) return null;
            
            existing.ItemName = item.ItemName;
            existing.Category = item.Category;
            existing.Quantity = item.Quantity;
            existing.Unit = item.Unit;
            existing.DateAdded = item.DateAdded;
            existing.Status = item.Status;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var existing = await _context.MiniItems.FindAsync(id);
            if (existing == null) return false;

            _context.MiniItems.Remove(existing);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
