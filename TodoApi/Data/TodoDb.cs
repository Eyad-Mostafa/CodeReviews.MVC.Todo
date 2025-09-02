using Microsoft.EntityFrameworkCore;
using TodoApi.Entities;

namespace TodoApi.Data;

class TodoDb(DbContextOptions<TodoDb> options) : DbContext(options)
{
    public DbSet<Todo> Todos => Set<Todo>();
}