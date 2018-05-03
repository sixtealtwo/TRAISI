using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DAL.Models;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace DAL.Core.Interfaces
{
    public interface IEntityManager<T>  where T : class
    {
        Task<EntityEntry<T>>  CreateEntityAsync(T entity);
        Task<T> GetEntityAsync(int id);
        Task<List<T>> GetEntitiesAsync();
        Task<T> DeleteEntityAsync(int id);
        Task<EntityEntry<T>> UpdateEntityAsync(T entity);
    }
}