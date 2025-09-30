using System.Collections.Generic;
using System.Threading.Tasks;
using BACKEND.Models;

namespace BACKEND.Services
{
    public interface IUserService
    {
        Task<IEnumerable<User>> GetAllAsync();
        Task<User?> GetByIdAsync(int id);
        Task<User> CreateAsync(User user);
        Task<User?> UpdateAsync(int id, User user);
        Task<bool> DeleteAsync(int id);  // <-- Add this
        Task<User?> GetByUsernameAsync(string username);
    }
}
