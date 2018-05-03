using System;
using System.Threading.Tasks;
using AspNet.Security.OpenIdConnect.Primitives;
using DAL.Core.Interfaces;
using DAL.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace DAL.Core
{
    public class EntityManager<T> : IEntityManager<T>  where T : class
    {
        private readonly ApplicationDbContext _context;

        
        public EntityManager(
            ApplicationDbContext context
            )
        {
            _context = context;

            
        }
        
        public async Task<EntityEntry<T>> CreateEntityAsync(T entity)
        {
            var result = await _context.AddAsync(entity);

            _context.SaveChanges();

            return result;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<T> GetEntityAsync(int id)
        {
            return await _context.FindAsync<T>(id);
        }
    }
}