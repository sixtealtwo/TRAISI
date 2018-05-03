using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DAL.Models;

namespace DAL.Core.Interfaces
{
    public interface IEntityManager<T>
    {
        Task<Tuple<bool, string[]>> CreateEntityAsync(T entity);
    }
}