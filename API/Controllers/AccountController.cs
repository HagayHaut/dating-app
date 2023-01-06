using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        public DataContext _dbContext { get; }
        public AccountController(DataContext dbContext)
        {
            _dbContext = dbContext;

        }

        [HttpPost("register")] // POST `api/accounts/register`
        public async Task<ActionResult<AppUser>> Register(RegisterDto registerDto)
        {
            if (await UserExists(registerDto.Username)) return BadRequest("Username is taken");

            using var hmac = new HMACSHA512(); // similar to bcrypt

            var user = new AppUser
            {
                UserName = registerDto.Username,
                PasswordHash = GetHash(hmac, registerDto.Password),
                PasswordSalt = hmac.Key
            };

            _dbContext.Users.Add(user);

            await _dbContext.SaveChangesAsync();

            return user;
        }

        [HttpPost("login")]
        public async Task<ActionResult<AppUser>> Login(LoginDto loginDto) 
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(user => user.UserName == loginDto.Username);

            if (user == null) return Unauthorized("Invalid username"); 

            using var hmac = new HMACSHA512(user.PasswordSalt);

            var computedHash = GetHash(hmac, loginDto.Password);

            if (!computedHash.SequenceEqual(user.PasswordHash)) return Unauthorized("Invalid password");

            return user;
        }

        private async Task<bool> UserExists(string username)
        {
            return await _dbContext.Users.AnyAsync(user => user.UserName.ToLower() == username.ToLower());
        }

        private byte[] GetHash(HMACSHA512 hmac, string password)
        {
            return hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
        }
    }
}