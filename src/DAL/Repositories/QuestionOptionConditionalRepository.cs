using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DAL.Models;
using DAL.Models.Questions;
using DAL.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Linq;
namespace DAL.Repositories
{
    /// <summary>
    /// 
    /// </summary>
    public class QuestionOptionConditionalRepository : Repository<QuestionOptionConditional>, IQuestionOptionConditionalRepository
    {
  
        public QuestionOptionConditionalRepository(ApplicationDbContext context) : base(context)
        {

        }
        
        private ApplicationDbContext _appContext => (ApplicationDbContext)_context;

        public void DeleteSourceConditionals(int questionPartId, List<int> retainedConditionals)
        {
            _appContext.QuestionOptionConditionals.RemoveRange(_appContext.QuestionOptionConditionals.Where(c => c.SourceQuestionId == questionPartId && !retainedConditionals.Contains(c.Id)));
        }
        public void DeleteTargetConditionals(int questionPartId, List<int> retainedConditionals)
        {
            _appContext.QuestionOptionConditionals.RemoveRange(_appContext.QuestionOptionConditionals.Where(c => c.TargetOption.QuestionPartId == questionPartId && !retainedConditionals.Contains(c.Id)));
        }

        public async Task<IEnumerable<QuestionOptionConditional>> GetQuestionOptionConditionalsAsync(int questionPartId)
        {
            return await _appContext.QuestionOptionConditionals
                .Where(q => q.SourceQuestionId == questionPartId)
                .ToListAsync();
        }

        public void ValidateSourceConditionals(int questionPartId, List<int> viableQuestionTargets)
        {
            _appContext.QuestionOptionConditionals.RemoveRange(_appContext.QuestionOptionConditionals.Where(c => c.SourceQuestionId == questionPartId && !viableQuestionTargets.Contains(c.TargetOption.QuestionPartId)));
        }
        public void ValidateTargetConditionals(int questionPartId, List<int> viableQuestionSources)
        {
            _appContext.QuestionOptionConditionals.RemoveRange(_appContext.QuestionOptionConditionals.Where(c => !viableQuestionSources.Contains(c.SourceQuestionId) && c.TargetOption.QuestionPartId == questionPartId));
        }
    }
}