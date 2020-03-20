using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DAL.Models;
using DAL.Models.Questions;
using DAL.Repositories.Interfaces;
using System.Linq;
using Microsoft.EntityFrameworkCore;
namespace DAL.Repositories
{
    /// <summary>
    /// 
    /// </summary>
    public class QuestionCondtionalGroupRepository : Repository<QuestionConditionalGroup>
    {
        private ApplicationDbContext _appContext => (ApplicationDbContext)_context;
        
        public QuestionCondtionalGroupRepository(DbContext context) : base(context)
        {
        }
    }
}