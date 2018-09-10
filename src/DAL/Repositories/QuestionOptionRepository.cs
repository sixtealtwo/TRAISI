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
    public class QuestionOptionRepository : Repository<QuestionOption>, IQuestionOptionRepository
    {
  
        public QuestionOptionRepository(ApplicationDbContext context) : base(context)
        {

        }
        
        private ApplicationDbContext _appContext => (ApplicationDbContext)_context;
        
        /// <summary>
        /// Finds a survey with the specified name (case insensitive)
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        public async Task<IEnumerable<QuestionOption>> GetQuestionOptionsFullAsync(int questionId) {

            var questionPart = await _appContext.QuestionParts
                .Where(o => o.Id == questionId)
                .Include(qo => qo.QuestionOptions)
                .ThenInclude(qo => qo.QuestionOptionLabels).FirstOrDefaultAsync();

            return questionPart.QuestionOptions.ToList();
        }

        /// <summary>
        /// Returns all conditionals where option is the target
        /// </summary>
        /// <param name="optionId"></param>
        /// <returns></returns>
        public async Task<IEnumerable<QuestionOptionConditional>> GetQuestionOptionConditionalsAsync(int optionId)
        {
            return await _appContext.QuestionOptions
            .Where(q => q.Id == optionId)
            .Include(q => q.QuestionOptionConditionalsTarget)
            .Select(q => q.QuestionOptionConditionalsTarget)
            .SingleOrDefaultAsync();
        }

    }
}