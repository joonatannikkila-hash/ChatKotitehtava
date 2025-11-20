namespace Backend.Models
{
    public class ChatMessage
    {
        public int Id { get; set; }
        public string Question { get; set; } = "";
        public string Answer { get; set; } = "";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}