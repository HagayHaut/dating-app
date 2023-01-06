using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class UsersController : BaseApiController
{
    private readonly ILogger<UsersController> _logger;
    private readonly DataContext _DbContext;

    public UsersController(DataContext DbContext, ILogger<UsersController> logger)
    {
        _DbContext = DbContext;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AppUser>>> GetUsers()
    {
        var users = await _DbContext.Users.ToListAsync();
        return users;
    }

    [HttpGet("{id}")] // "GET /api/users/:id"
    public async Task<ActionResult<AppUser>> GetUser(int id)
    {
        return await _DbContext.Users.FindAsync(id);
    }
}
