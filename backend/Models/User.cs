using System;
using System.ComponentModel.DataAnnotations;

namespace BACKEND.Models
{
    public class User
    {
        public int Id { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string Email { get;  set; }
        public string PasswordHash { get; set; } = string.Empty; // Store hashed password
    }
}
