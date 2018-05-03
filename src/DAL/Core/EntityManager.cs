using System;
using System.Threading.Tasks;
using AspNet.Security.OpenIdConnect.Primitives;
using DAL.Core.Interfaces;
using DAL.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;

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
            //_context.CurrentUserId = httpAccessor.HttpContext?.User.FindFirst(OpenIdConnectConstants.Claims.Subject)?.Value?.Trim();

            
        }
        
        public Task<Tuple<bool, string[]>> CreateEntityAsync(T entity)
        {
            //_context.
            _context.Add(entity);

            _context.SaveChanges();

            return null;
        }
    }
}