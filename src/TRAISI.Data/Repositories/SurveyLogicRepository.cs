using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Traisi.Data.Models;
using Traisi.Data.Models.Questions;
using Traisi.Data.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using Traisi.Data.Models.Surveys;
using Traisi.Data.Models.Extensions;

namespace Traisi.Data.Repositories
{
    /// <summary>
    /// 
    /// </summary>
    public class SurveyLogicRepository : Repository<SurveyLogic>, ISurveyLogicRepository
    {
        public SurveyLogicRepository(ApplicationDbContext context) : base(context) { }

        private ApplicationDbContext _appContext => (ApplicationDbContext)_context;

        public async Task<SurveyLogic> GetSurveyLogicExpressionTreeForQuestionAsync(QuestionPart question) {

            var containing =  await this._entities.Where(s => s.Question.QuestionPart.Id == question.Id).ToListAsync();
            return containing[0];
        }

    }
}