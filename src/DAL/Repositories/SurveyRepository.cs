using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL.Models;
using DAL.Models.Surveys;
using DAL.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.IO;


namespace DAL.Repositories
{
    public class SurveyRepository : Repository<Survey>, ISurveyRepository
    {
        public SurveyRepository(ApplicationDbContext context) : base(context)
        {
        }

        public SurveyRepository(DbContext context) : base(context)
        {
        }

        private ApplicationDbContext _appContext => (ApplicationDbContext)_context;

        /// <summary>
        /// Loads a survey and all associated objects from a given inputstream with JSON data
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public async void LoadSurveyFromJson(Stream data)
        {
            await this.AddAsync(new Survey());
        }

        /// <summary>
        /// Finds a survey with the specified name (case insensitive)
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        public async Task<Survey> GetSurveyByNameFullAsync(string name)
        {
            return await _appContext.Surveys
                .Where(s => String.Equals(s.Name, name, StringComparison.CurrentCultureIgnoreCase))
                .Include(s => s.SurveyViews).ThenInclude(v => v.WelcomePageLabels)
                .Include(s => s.SurveyViews).ThenInclude(v => v.TermsAndConditionsLabels)
                .Include(s => s.SurveyViews).ThenInclude(v => v.ThankYouPageLabels)
                .Include(s => s.TitleLabels)
                .FirstOrDefaultAsync();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="surveyId"></param>
        /// <returns></returns>
        public async Task<Survey> GetSurveyFullAsync(int surveyId)
        {
            return await _appContext.Surveys.Where(s => s.Id == surveyId)
                .Include(s => s.SurveyViews).ThenInclude(v => v.WelcomePageLabels)
                .Include(s => s.SurveyViews).ThenInclude(v => v.TermsAndConditionsLabels)
                .Include(s => s.SurveyViews).ThenInclude(v => v.ThankYouPageLabels)
                .Include(s => s.TitleLabels)
                .Include(s => s.SurveyViews).ThenInclude(v => v.QuestionPartViews)
                .Include(s => s.SurveyViews).ThenInclude(v => v.QuestionPartViews).ThenInclude(q => q.Labels)
                .Include(s => s.SurveyViews).ThenInclude(v => v.QuestionPartViews).ThenInclude(q => q.QuestionPart)
                .Include(s => s.SurveyViews).ThenInclude(v => v.QuestionPartViews).ThenInclude(qpv => qpv.QuestionPart).ThenInclude(qp => qp.QuestionConfigurations)
                .Include(s => s.SurveyViews).ThenInclude(v => v.QuestionPartViews).ThenInclude(qpv => qpv.QuestionPart).ThenInclude(qp => qp.QuestionOptions)
                .SingleOrDefaultAsync();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="shortcode"></param>
        /// <returns></returns>
        public async Task<Survey> GetSurveyForShortcode(string shortcode)
        {
            var result = await _appContext.Shortcodes.Where(s => s.Code == shortcode)
            .Include(s => s.Survey).FirstOrDefaultAsync();

            return result?.Survey;

        }

        /// <summary>
        /// Gets all surveys owned by a specific user
        /// </summary>
        /// <param name="userName"></param>
        /// <returns></returns>
        public async Task<IEnumerable<Survey>> GetAllUserSurveysAsync(string userName)
        {
            return await _appContext.Surveys
                .Where(s => s.Owner == userName)
                .Include(s => s.SurveyPermissions)
                .OrderByDescending(g => g.CreatedDate)
                .ToListAsync();
        }

        /// <summary>
        /// Gets all surveys owned by a specific group
        /// </summary>
        /// <param name="groupName"></param>
        /// <returns></returns>
        public async Task<IEnumerable<Survey>> GetAllGroupSurveysAsync(string groupName)
        {
            return await _appContext.Surveys
                .Where(s => s.Group == groupName)
                .OrderByDescending(g => g.CreatedDate)
                .ToListAsync();
        }

        /// <summary>
        /// Gets all surveys owned by other members of a specific group
        /// with permission for specific user
        /// </summary>
        /// <param name="groupName">name of group</param>
        /// <param name="exceptUserName">user to exclude from list</param>
        /// <returns></returns>
        public async Task<IEnumerable<Survey>> GetAllGroupSurveysAsync(string groupName, string exceptUserName)
        {
            return await _appContext.Surveys
                .Where(s => s.Group == groupName && s.Owner != exceptUserName &&
                            s.SurveyPermissions.Where(r => r.User.UserName == exceptUserName).Count() == 0)
                .OrderByDescending(g => g.CreatedDate)
                .ToListAsync();
        }

        /// <summary>
        /// Gets a survey with its permissions
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<Survey> GetSurveyWithPermissionsAsync(int id)
        {
            return await _appContext.Surveys
                .Where(s => s.Id == id)
                .Include(s => s.SurveyPermissions)
                .FirstOrDefaultAsync();
        }

        /// <summary>
        /// Get survey with permissions for given user
        /// </summary>
        /// <param name="id"></param>
        /// <param name="userName"></param>
        /// <returns></returns>
        public async Task<Survey> GetSurveyWithUserPermissionsAsync(int id, string userName)
        {
            var survey = await _appContext.Surveys
                .Where(s => s.Id == id)
                .SingleOrDefaultAsync();
            survey.SurveyPermissions = await _appContext.SurveyPermissions
                .Where(sp => sp.Survey == survey && sp.User.UserName == userName)
                .ToListAsync();
            return survey;
        }


        /// <summary>
        /// Get all surveys shared with given user
        /// </summary>
        /// <param name="userName"></param>
        /// <returns></returns>
        public async Task<IEnumerable<Survey>> GetSharedSurveysAsync(string userName)
        {
            var surveyPermissions = await _appContext.SurveyPermissions
                .Where(sp => sp.User.UserName == userName)
                .Include(sp => sp.Survey).Include(sp => sp.User)
                .ToListAsync();

            List<Survey> sharedSurveys = new List<Survey>();

            surveyPermissions.ForEach(sp =>
            {
                sharedSurveys.Add(sp.Survey);
                sp.Survey.SurveyPermissions = new List<SurveyPermission>
                {
                    sp
                };
            });

            return sharedSurveys;
        }
    }
}