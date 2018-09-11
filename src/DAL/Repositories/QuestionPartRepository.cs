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
            var options = (await _appContext.QuestionParts
                .Where(q => q.Id == id)
                .Include(q => q.QuestionOptions).ThenInclude(o => o.QuestionOptionLabels)
                .SingleOrDefaultAsync())?.QuestionOptions;
            return options?.OrderBy(o => o.Name).ThenBy(o => o.Order);
        }

        public async Task<QuestionPart> GetQuestionPartWithConfigurationsAsync(int id)
        {
            return await _appContext.QuestionParts
                .Where(q => q.Id == id)
                .Include(q => q.QuestionConfigurations)
                .SingleOrDefaultAsync();
        }

        public async Task<QuestionPart> GetQuestionPartWithOptionsAsync(int id)
        {
            return await _appContext.QuestionParts
                .Where(q => q.Id == id)
                .Include(q => q.QuestionOptions).ThenInclude(o => o.QuestionOptionLabels)
                .SingleOrDefaultAsync();
        }

        public IEnumerable<QuestionPart> GetQuestionPartsWithConditionals(List<int> ids)
        {
            return _appContext.QuestionParts
               .Where(q => ids.Contains(q.Id))
               .Include(q => q.QuestionConditionalsSource)
               .Include(q => q.QuestionConditionalsTarget)
               .ToList();
        }

        public QuestionPart GetQuestionPartWithConditionals(int id)
        {
            return  _appContext.QuestionParts
               .Where(q => q.Id == id)
               .Include(q => q.QuestionConditionalsSource)
               .Include(q => q.QuestionConditionalsTarget)
               .Single();
        }

        public async Task<QuestionPart> GetQuestionPartWithConditionalsAsync(int id)
        {
            return await _appContext.QuestionParts
                .Where(q => q.Id == id)
                .Include(q => q.QuestionConditionalsSource)
                .Include(q => q.QuestionConditionalsTarget)
                .SingleOrDefaultAsync();
        }

        /// <summary>
        /// Returns all conditionals where the question part is the source
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<IEnumerable<QuestionConditional>> GetQuestionPartSourceConditionalsAsync(int id)
        {
            return await _appContext.QuestionParts
                .Where(q => q.Id == id)
                .Include(q => q.QuestionConditionalsSource)
                .Select(q => q.QuestionConditionalsSource)
                .SingleOrDefaultAsync();
        }

        /// <summary>
        /// Returns all conditionals where the question part is the target (fills in SourceQuestion)
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<IEnumerable<QuestionConditional>> GetQuestionPartTargetConditionalsAsync(int id)
        {
            return await _appContext.QuestionParts
                .Where(q => q.Id == id)
                .Include(q => q.QuestionConditionalsTarget)
                .Select(q => q.QuestionConditionalsTarget)
                .SingleOrDefaultAsync();
        }

        public async Task<IEnumerable<QuestionPart>> GetQuestionPartsWithTargetConditionalsAsync(List<int> ids)
        {
            return await _appContext.QuestionParts
                .Where(q => ids.Contains(q.Id))
                .Include(q => q.QuestionConditionalsTarget)
                .ToListAsync();
        }

        public IEnumerable<QuestionPart> GetQuestionPartsWithTargetConditionals(List<int> ids)
        {
            return _appContext.QuestionParts
               .Where(q => ids.Contains(q.Id))
               .Include(q => q.QuestionConditionalsTarget)
               .ToList();
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