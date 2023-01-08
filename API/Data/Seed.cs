
using API.Entities;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace API.Data
{
    public class Seed
    {
        public static async Task SeedUsers(DataContext dbContext)
        {
            if (await dbContext.Users.AnyAsync()) return;

            var userData = await File.ReadAllTextAsync("Data/UserSeedData.json");

            var options = new JsonSerializerOptions{PropertyNameCaseInsensitive = true};

            var users = JsonConvert.DeserializeObject<List<AppUser>>(userData);
            
            foreach (var user in users)
            {
                using var hmac = new HMACSHA512();
                user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("Pa$$w0rd"));
                user.PasswordSalt = hmac.Key;

                dbContext.Users.Add(user);
            }

            await dbContext.SaveChangesAsync();
        }
    }
}