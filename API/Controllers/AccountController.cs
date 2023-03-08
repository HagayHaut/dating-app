using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly DataContext _dbContext;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;
        public AccountController(DataContext dbContext, ITokenService tokenService, IMapper mapper)
        {
            _mapper = mapper;
            _tokenService = tokenService;
            _dbContext = dbContext;

        }

        [HttpPost("register")] // POST `api/accounts/register`
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (await UserExists(registerDto.Username)) return BadRequest("Username is taken");

            var user = _mapper.Map<AppUser>(registerDto);
            
            using var hmac = new HMACSHA512(); // similar to bcrypt

            user.UserName = registerDto.Username;
            user.PasswordHash = GetHash(hmac, registerDto.Password);
            user.PasswordSalt = hmac.Key;
           
            _dbContext.Users.Add(user);

            await _dbContext.SaveChangesAsync();

            return new UserDto
            {
                Username = user.UserName,
                Token = _tokenService.CreateToken(user),
                KnownAs = user.KnownAs
            };
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto) 
        {
            var user = await _dbContext.Users
                .Include(p => p.Photos)
                .FirstOrDefaultAsync(user => user.UserName == loginDto.Username);

            if (user == null) return Unauthorized("Invalid username"); 

            using var hmac = new HMACSHA512(user.PasswordSalt);

            var computedHash = GetHash(hmac, loginDto.Password);

            if (!computedHash.SequenceEqual(user.PasswordHash)) return Unauthorized("Invalid password");

            return new UserDto
            {
                Username = user.UserName,
                Token = _tokenService.CreateToken(user),
                PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
                KnownAs = user.KnownAs
            };
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