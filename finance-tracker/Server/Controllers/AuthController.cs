using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Domain;
using Server.DTO;
using Server.Services;

namespace Server.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    // 1. Declare the field here
    private readonly TokenService _tokenService;

    // 2. Add it to the constructor parameters
    public AuthController(AppDbContext context, TokenService tokenService)
    {
        _context = context;
        // 3. Assign it to the field
        _tokenService = tokenService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(UserRegisterDto request)
    {
        // 1. Check if user already exists
        if (await _context.Users.AnyAsync(u => u.Username == request.Username))
        {
            return BadRequest("Username already exists.");
        }

        // 2. Create the user and hash the password
        var user = new User
        {
            Username = request.Username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = "Standard" // Default role assigned to new sign-ups
        };

        // 3. Save to database
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new { message = "User registered successfully." });
    }
    [HttpPost("login")]
    public async Task<IActionResult> Login(UserLoginDto request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == request.Username);
        
        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return Unauthorized("Invalid username or password.");

        return Ok(new { token = _tokenService.CreateToken(user) });
    }
    
}