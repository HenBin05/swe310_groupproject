namespace Server.Domain;

public class User
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    
    // Project requirement: At least two distinct user roles (e.g., Admin or Standard)
    public string Role { get; set; } = "Standard"; 
}