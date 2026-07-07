namespace Server.DTO;

// Used when sending data TO the React frontend
public class TransactionReadDto
{
    public int Id { get; set; }
    public decimal Amount { get; set; }
    public DateTime Date { get; set; }
    public string Description { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty; // Flattens the relational data
}

// Used when receiving data FROM the React frontend
public class TransactionCreateDto
{
    public decimal Amount { get; set; }
    public DateTime Date { get; set; }
    public string Description { get; set; } = string.Empty;
    public int CategoryId { get; set; } 
}