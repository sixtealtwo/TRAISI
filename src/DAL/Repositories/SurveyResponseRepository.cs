using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DAL.Models;
using DAL.Models.Surveys;
using DAL.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories
{
    public class SurveyResponseRepository : Repository<SurveyResponse>, ISurveyResponseRepository
    {
        private ApplicationDbContext _appContext => (ApplicationDbContext)_context;
        public SurveyResponseRepository(DbContext context) : base(context)
        {



        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="questionId"></param>
        /// <param name="shortcode"></param>
        /// <returns></returns>
        public async Task<List<SurveyResponse>> ListQuestionResponsesForRespondentAsync(int questionId, string shortcode)
        {

            return await this._entities.ToListAsync();
        }


        /// <summary>
        /// 
        /// </summary>
        /// <param name="user"></param>
        /// <param name="questionName"></param>
        /// <returns></returns>
        public async Task<SurveyResponse> GetQuestionResponeByQuestionName(ApplicationUser user, string questionName)
        {

            return await this._entities.Where(u => u.Respondent == user).
Where(q => q.QuestionPart.Name.ToLower() == questionName.ToLower())
.Include(s => s.ResponseValue).
ThenInclude(s => s.SurveyResponse).FirstOrDefaultAsync();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="surveyId"></param>
        /// <param name="user"></param>
        /// <returns></returns>
        public async Task<List<SurveyResponse>> ListMostRecentQuestionResponsesForRespondentAsync(int surveyId, ApplicationUser user)
        {

           var result = await this._entities.
           Where(r => r.QuestionPart.Parent.SurveyView.Survey.Id == surveyId && r.Respondent == user)
           .ToListAsync();
           
            return result;
        }

    }
}