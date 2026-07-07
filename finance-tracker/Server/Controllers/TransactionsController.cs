using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Domain;
using Server.DTO;

namespace Server.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize] // Lock down this entire controller to logged-in users only
public class TransactionsController : ControllerBase
{
    private readonly AppDbContext _context;

    public TransactionsController(AppDbContext context)
    {
        _context = context;
    }

    // --- HELPER METHOD: Extract User ID from the JWT ---
    private int GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.Parse(userIdClaim ?? "0");
    }

    // 1. READ: Get only the logged-in user's transactions
    [HttpGet]
    public async Task<IActionResult> GetMyTransactions()
    {
        var userId = GetCurrentUserId();

        var transactions = await _context.Transactions
            .Include(t => t.Category) // Join with the Category table
            .Where(t => t.UserId == userId) // SECURITY: Only fetch this user's data
            .Select(t => new TransactionReadDto
            {
                Id = t.Id,
                Amount = t.Amount,
                Date = t.Date,
                Description = t.Description,
                CategoryName = t.Category != null ? t.Category.Name : "Uncategorized"
            })
            .ToListAsync();

        return Ok(transactions);
    }

    // 2. CREATE: Add a new transaction linked to the logged-in user
    [HttpPost]
    public async Task<IActionResult> CreateTransaction(TransactionCreateDto dto)
    {
        var userId = GetCurrentUserId();

        var transaction = new Transaction
        {
            Amount = dto.Amount,
            Date = dto.Date,
            Description = dto.Description,
            CategoryId = dto.CategoryId,
            UserId = userId // SECURITY: Force the transaction to belong to the token owner
        };

        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Transaction created successfully.", id = transaction.Id });
    }

    // 3. DELETE: Remove a transaction (if the user owns it)
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTransaction(int id)
    {
        var userId = GetCurrentUserId();
        
        var transaction = await _context.Transactions.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

        if (transaction == null)
            return NotFound("Transaction not found or you do not have permission to delete it.");

        _context.Transactions.Remove(transaction);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Transaction deleted." });
    }
}