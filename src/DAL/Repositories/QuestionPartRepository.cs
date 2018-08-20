using DAL.Models;
using DAL.Models.Questions;
using DAL.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DAL.Repositories
{
    /// <summary>
    /// 
    /// </summary>
    public class QuestionPartRepository : Repository<QuestionPart>, IQuestionPartRepository
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="context"></param>
        public QuestionPartRepository(ApplicationDbContext context) : base(context)
        {
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        private ApplicationDbContext _appContext => (ApplicationDbContext)_context;

        public async Task<IEnumerable<QuestionConfiguration>> GetQuestionPartConfigurationsAsync(int id)
        {
            return (await _appContext.QuestionParts
                .Where(q => q.Id == id)
                .Include(q => q.QuestionConfigurations)
                .SingleOrDefaultAsync())?.QuestionConfigurations;

        }
        public async Task<IEnumerable<QuestionOption>> GetQuestionPartOptionsAsync(int id)
        {
            return (await _appContext.QuestionParts
                .Where(q => q.Id == id)
                .Include(q => q.QuestionConfigurations)
                .SingleOrDefaultAsync())?.QuestionOptions;
        }

        public async Task<QuestionPart> GetQuestionPartWithConfigurationsAsync(int id)
        {
            return await _appContext.QuestionParts
                .Where(q => q.Id == id)
                .Include(q => q.QuestionConfigurations)
                .SingleOrDefaultAsync();
        }

				public async Task<int> GetNumberOfParentViewsAsync(int id)
				{
					return await _appContext.QuestionPartViews
						.Where(q => q.QuestionPart.Id == id)
						.CountAsync();
				}

				public int GetNumberOfParentViews(int id)
				{
					return _appContext.QuestionPartViews
						.Where(q => q.QuestionPart.Id == id)
						.Count();
				}
    }
}