using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Data
{
    public class ChatDbContext : DbContext
    {
        public ChatDbContext(DbContextOptions<ChatDbContext> options)
            : base(options) { }

        public DbSet<ChatMessage> ChatMessages => Set<ChatMessage>();
    }
}