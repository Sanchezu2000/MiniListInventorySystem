using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BACKEND.Models;
using BACKEND.Repositories;
using BCrypt.Net;

namespace BACKEND.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;

        public AuthController(IUserRepository userRepository, IConfiguration configuration)
        {
            _userRepository = userRepository;
            _configuration = configuration;
        }
        [HttpPost("register")]
public async Task<IActionResult> Register([FromBody] RegisterDto dto)
{
    
    // Check if username already exists
            var existingUser = await _userRepository.GetByUsernameAsync(dto.UserName);
    if (existingUser != null)
    {
        return BadRequest("Username already exists");
    }

    // Hash the password
    string passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

       
    var newUser = new User
    {
        UserName = dto.UserName,
        Email = dto.email,
        PasswordHash = passwordHash
    };

    await _userRepository.CreateAsync(newUser);

    return Ok(new
    {
        message = "Registration successful",
        newUser.Id,
        newUser.UserName,
        newUser.Email
    });
}

// DTO for registration
public class RegisterDto
{
    public string UserName { get; set; } = string.Empty;
    public string email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}


        // POST: api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _userRepository.GetByUsernameAsync(dto.UserName);
            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            {
                return Unauthorized("Invalid username or password");
            }

            var token = GenerateJwtToken(user);

            return Ok(new
            {
                token,
                user.Id,
                user.UserName
            });
        }
        private string GenerateJwtToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                new Claim("id", user.Id.ToString()),
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    // DTO for login request
    public class LoginDto
    {
        public string UserName { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
