using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DAL.Models;
using DAL.Models.ResponseTypes;
using DAL.Models.Surveys;
using DAL.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories
{
    public class SurveyResponseRepository : Repository<SurveyResponse>, ISurveyResponseRepository
    {
        private ApplicationDbContext _appContext => (ApplicationDbContext)_context;
        public SurveyResponseRepository(DbContext context) : base(context) { }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="questionId"></param>
        /// <param name="shortcode"></param>
        /// <returns></returns>
        public async Task<List<SurveyResponse>>
            ListQuestionResponsesForRespondentAsync(int questionId, string shortcode)
        {
            return await this._entities.ToListAsync();
        }




        /// <summary>
        /// 
        /// </summary>
        /// <param name="user"></param>
        /// <param name="questionName"></param>
        /// <returns></returns>
        public async Task<SurveyResponse> GetQuestionResponeByQuestionName(SurveyRespondent user, string questionName)
        {
            return await this._entities.Where(u => u.Respondent == user)
                .Where(q => q.QuestionPart.Name.ToLower() == questionName.ToLower())
                .Include(s => s.ResponseValue).ThenInclude(s => s.SurveyResponse).FirstOrDefaultAsync();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="surveyId"></param>
        /// <param name="user"></param>
        /// <returns></returns>
        public async Task<List<SurveyResponse>> ListMostRecentQuestionResponsesForRespondentAsync(int surveyId,
            SurveyRespondent user)
        {
            var result = await this._entities
                .Where(r => r.QuestionPart.Parent.SurveyView.Survey.Id == surveyId && r.Respondent == user)
                .ToListAsync();

            return result;
        }


        /// <summary>
        /// 
        /// </summary>
        /// <param name="surveyId"></param>
        /// <param name="user"></param>
        /// <param name="type"></param>
        /// <returns></returns>
        public async Task<List<SurveyResponse>> ListSurveyResponsesForRespondentByTypeAsync(int surveyId, SurveyRespondent user, ResponseTypes type)
        {
            var responses = new List<SurveyResponse>();
            if (type == ResponseTypes.LocationResponse) {

                var result = await this._appContext.LocationResponseValues.Where(r => (r.SurveyResponse.QuestionPart.Parent.SurveyView.Survey.Id == surveyId ||
                r.SurveyResponse.QuestionPart.Parent.ParentView.SurveyView.Survey.Id == surveyId || r.SurveyResponse.QuestionPart.Parent.ParentView.ParentView.SurveyView.Survey.Id == surveyId)
                && user == r.SurveyResponse.Respondent
                ).Include(r => r.SurveyResponse)
                    .ThenInclude(r => r.Respondent)
                    .ToListAsync();

                foreach (var r in result) {
                    responses.Add(r.SurveyResponse);
                }


                return responses;
            }
            else {
                return responses;
            }

        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="questionId"></param>
        /// <param name="user"></param>
        /// <returns></returns>
        public async Task<SurveyResponse> GetMostRecentResponseForQuestionByRespondentAsync(int questionId,
            SurveyRespondent user)
        {
            var result = await this._entities.Where(s => s.Respondent == user && s.QuestionPart.Id == questionId)
            .Include(v => v.ResponseValue)
                .ToAsyncEnumerable().OrderByDescending(s => s.UpdatedDate).FirstOrDefault();

            return result;
        }
    }
}