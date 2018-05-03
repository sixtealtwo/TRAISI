using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AspNet.Security.OpenIdConnect.Primitives;
using DAL.Core.Interfaces;
using DAL.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace DAL.Core
{
    public class EntityManager<T> : IEntityManager<T> where T : class
    {
        private readonly ApplicationDbContext _context;


        public EntityManager(
            ApplicationDbContext context
        )
        {
            _context = context;
        }

        /// <summary>
        /// Create entity
        /// </summary>
        public async Task<EntityEntry<T>> CreateEntityAsync(T entity)
        {
            var result = await _context.AddAsync(entity);

            _context.SaveChanges();

            return result;
        }

        /// <summary>
        /// Delete entity by Id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<T> DeleteEntityAsync(int id)
        {
            var result = await _context.FindAsync<T>(id);

            _context.Remove(result);

            await _context.SaveChangesAsync();

            return null;
        }

        /// <summary>
        /// Update Entity
        /// </summary>
        public async Task<EntityEntry<T>> UpdateEntityAsync(T entity)
        {
            var result = _context.Update(entity);

            await _context.SaveChangesAsync();

            return result;

        }


        /// <summary>
        /// Get entity by Id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<T> GetEntityAsync(int id)
        {
            return await _context.FindAsync<T>(id);
        }

        /// <summary>
        /// Get all entities to list
        /// </summary>
        public async Task<List<T>> GetEntitiesAsync()
        {
            return await _context.Set<T>().ToListAsync();
        }
    }
}