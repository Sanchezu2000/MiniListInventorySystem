using System.Collections.Generic;
using System.Threading.Tasks;
using BACKEND.Models;

namespace BACKEND.Repositories
{
    public interface IUserRepository
{
    Task<IEnumerable<User>> GetAllAsync();
    Task<User?> GetByIdAsync(int id);
    Task<User> CreateAsync(User user);
    Task<User?> UpdateAsync(int id, User user);
    Task<bool> DeleteAsync(int id);
    Task<User?> GetByUsernameAsync(string UserName);
}

}
