namespace Server.Domain;

public class Transaction
{
    public int Id { get; set; }
    public decimal Amount { get; set; }
    public DateTime Date { get; set; }
    public string Description { get; set; } = string.Empty;

    // Foreign Keys to establish relationships (Project Requirement)
    public int UserId { get; set; }
    public User? User { get; set; }

    public int CategoryId { get; set; }
    public Category? Category { get; set; }
}