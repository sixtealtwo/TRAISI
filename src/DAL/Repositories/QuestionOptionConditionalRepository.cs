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

    }
}