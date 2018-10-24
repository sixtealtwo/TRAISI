using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL.Models;
using DAL.Models.Questions;
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
        /// <param name="name"></param>
        /// <returns></returns>
        public async Task<Survey> GetSurveyByCodeFullAsync(string code)
        {
            return await _appContext.Surveys
                .Where(s => String.Equals(s.Code, code, StringComparison.CurrentCultureIgnoreCase))
                .Include(s => s.SurveyViews).ThenInclude(v => v.WelcomePageLabels)
                .Include(s => s.SurveyViews).ThenInclude(v => v.TermsAndConditionsLabels)
                .Include(s => s.SurveyViews).ThenInclude(v => v.ThankYouPageLabels)
                .Include(s => s.TitleLabels)
                .FirstOrDefaultAsync();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        public async Task<Survey> GetSurveyByCodeAsync(string code)
        {
            return await _appContext.Surveys
                .Where(s => String.Equals(s.Code, code, StringComparison.CurrentCultureIgnoreCase))
                .FirstOrDefaultAsync();
        }

        public async Task<Survey> GetSurveyLabelsAndPartsAsync(int surveyId)
        {
            return await _appContext.Surveys.Where(s => s.Id == surveyId)
                .Include(s => s.TitleLabels)
                .Include(s => s.SurveyViews).ThenInclude(v => v.WelcomePageLabels)
                .Include(s => s.SurveyViews).ThenInclude(v => v.TermsAndConditionsLabels)
                .Include(s => s.SurveyViews).ThenInclude(v => v.ThankYouPageLabels)
                .Include(s => s.SurveyViews).ThenInclude(v => v.QuestionPartViews).ThenInclude(q => q.Labels)
                .Include(s => s.SurveyViews).ThenInclude(v => v.QuestionPartViews).ThenInclude(q => q.QuestionPartViewChildren).ThenInclude(q2 => q2.Labels)
                .Include(s => s.SurveyViews).ThenInclude(v => v.QuestionPartViews).ThenInclude(q => q.QuestionPartViewChildren).ThenInclude(q2 => q2.QuestionPart)
                .Include(s => s.SurveyViews).ThenInclude(v => v.QuestionPartViews).ThenInclude(q => q.QuestionPartViewChildren).ThenInclude(q => q.QuestionPartViewChildren).ThenInclude(q2 => q2.Labels)
                .Include(s => s.SurveyViews).ThenInclude(v => v.QuestionPartViews).ThenInclude(q => q.QuestionPartViewChildren).ThenInclude(q => q.QuestionPartViewChildren).ThenInclude(q2 => q2.QuestionPart)
                .SingleOrDefaultAsync();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="surveyId"></param>
        /// <returns></returns>
        public async Task<Survey> GetSurveyFullExportAsync(int surveyId)
        {
            return await _appContext.Surveys.Where(s => s.Id == surveyId)
                .Include(s => s.TitleLabels)
                .Include(s => s.SurveyViews).ThenInclude(v => v.WelcomePageLabels)
                .Include(s => s.SurveyViews).ThenInclude(v => v.TermsAndConditionsLabels)
                .Include(s => s.SurveyViews).ThenInclude(v => v.ThankYouPageLabels)
                .Include(s => s.SurveyViews).ThenInclude(v => v.QuestionPartViews).ThenInclude(q => q.Labels)
                .Include(s => s.SurveyViews).ThenInclude(v => v.QuestionPartViews).ThenInclude(q => q.QuestionPartViewChildren).ThenInclude(q2 => q2.Labels)
                .Include(s => s.SurveyViews).ThenInclude(v => v.QuestionPartViews).ThenInclude(q => q.QuestionPartViewChildren).ThenInclude(q2 => q2.QuestionPart).ThenInclude(qp => qp.QuestionConfigurations).ThenInclude(qc => qc.QuestionConfigurationLabels)
                .Include(s => s.SurveyViews).ThenInclude(v => v.QuestionPartViews).ThenInclude(q => q.QuestionPartViewChildren).ThenInclude(q2 => q2.QuestionPart).ThenInclude(qp => qp.QuestionOptions).ThenInclude(qo => qo.QuestionOptionLabels)
                .Include(s => s.SurveyViews).ThenInclude(v => v.QuestionPartViews).ThenInclude(q => q.QuestionPartViewChildren).ThenInclude(q2 => q2.QuestionPart).ThenInclude(qp => qp.QuestionOptions).ThenInclude(qo => qo.QuestionOptionConditionalsTarget)
                .Include(s => s.SurveyViews).ThenInclude(v => v.QuestionPartViews).ThenInclude(q => q.QuestionPartViewChildren).ThenInclude(q2 => q2.QuestionPart).ThenInclude(qp => qp.QuestionConditionalsSource)
                .Include(s => s.SurveyViews).ThenInclude(v => v.QuestionPartViews).ThenInclude(q => q.QuestionPartViewChildren).ThenInclude(q2 => q2.QuestionPart).ThenInclude(qp => qp.QuestionConditionalsTarget)
                .Include(s => s.SurveyViews).ThenInclude(v => v.QuestionPartViews).ThenInclude(q => q.QuestionPartViewChildren).ThenInclude(q2 => q2.QuestionPart).ThenInclude(qp => qp.QuestionOptionConditionalsSource)
                .Include(s => s.SurveyViews).ThenInclude(v => v.QuestionPartViews).ThenInclude(q => q.QuestionPartViewChildren).ThenInclude(q => q.QuestionPartViewChildren).ThenInclude(q2 => q2.Labels)
                .Include(s => s.SurveyViews).ThenInclude(v => v.QuestionPartViews).ThenInclude(q => q.QuestionPartViewChildren).ThenInclude(q => q.QuestionPartViewChildren).ThenInclude(q2 => q2.QuestionPart).ThenInclude(qp => qp.QuestionConfigurations).ThenInclude(qc => qc.QuestionConfigurationLabels)
                .Include(s => s.SurveyViews).ThenInclude(v => v.QuestionPartViews).ThenInclude(q => q.QuestionPartViewChildren).ThenInclude(q => q.QuestionPartViewChildren).ThenInclude(q2 => q2.QuestionPart).ThenInclude(qp => qp.QuestionOptions).ThenInclude(qo => qo.QuestionOptionLabels)
                .Include(s => s.SurveyViews).ThenInclude(v => v.QuestionPartViews).ThenInclude(q => q.QuestionPartViewChildren).ThenInclude(q => q.QuestionPartViewChildren).ThenInclude(q2 => q2.QuestionPart).ThenInclude(qp => qp.QuestionOptions).ThenInclude(qo => qo.QuestionOptionConditionalsTarget)
                .Include(s => s.SurveyViews).ThenInclude(v => v.QuestionPartViews).ThenInclude(q => q.QuestionPartViewChildren).ThenInclude(q => q.QuestionPartViewChildren).ThenInclude(q2 => q2.QuestionPart).ThenInclude(qp => qp.QuestionConditionalsSource)
                .Include(s => s.SurveyViews).ThenInclude(v => v.QuestionPartViews).ThenInclude(q => q.QuestionPartViewChildren).ThenInclude(q => q.QuestionPartViewChildren).ThenInclude(q2 => q2.QuestionPart).ThenInclude(qp => qp.QuestionConditionalsTarget)
                .Include(s => s.SurveyViews).ThenInclude(v => v.QuestionPartViews).ThenInclude(q => q.QuestionPartViewChildren).ThenInclude(q => q.QuestionPartViewChildren).ThenInclude(q2 => q2.QuestionPart).ThenInclude(qp => qp.QuestionOptionConditionalsSource)
                .SingleOrDefaultAsync();
        }



        public async Task<Survey> GetSurveyFullAsync(int surveyId)
        {
            var result = await _appContext.Surveys.Where(s => s.Id == surveyId)
                .Include(s => s.TitleLabels)
                .Include(s => s.SurveyViews).ThenInclude(v => v.WelcomePageLabels)
                .Include(s => s.SurveyViews).ThenInclude(v => v.TermsAndConditionsLabels)
                .Include(s => s.SurveyViews).ThenInclude(v => v.ThankYouPageLabels)
                .Include(s => s.SurveyViews).ThenInclude(v => v.QuestionPartViews).ThenInclude(q => q.Labels)
                .Include(s => s.SurveyViews).ThenInclude(v => v.QuestionPartViews).ThenInclude(q => q.QuestionPartViewChildren).ThenInclude(q2 => q2.Labels)
                .Include(s => s.SurveyViews).ThenInclude(v => v.QuestionPartViews).ThenInclude(q => q.QuestionPartViewChildren).ThenInclude(q2 => q2.QuestionPart).ThenInclude(qp => qp.QuestionConfigurations).ThenInclude(qc => qc.QuestionConfigurationLabels)
                .Include(s => s.SurveyViews).ThenInclude(v => v.QuestionPartViews).ThenInclude(q => q.QuestionPartViewChildren).ThenInclude(q2 => q2.QuestionPart).ThenInclude(qp => qp.QuestionOptions).ThenInclude(qo => qo.QuestionOptionLabels)
                .Include(s => s.SurveyViews).ThenInclude(v => v.QuestionPartViews).ThenInclude(q => q.QuestionPartViewChildren).ThenInclude(q => q.QuestionPartViewChildren).ThenInclude(q2 => q2.Labels)
                .Include(s => s.SurveyViews).ThenInclude(v => v.QuestionPartViews).ThenInclude(q => q.QuestionPartViewChildren).ThenInclude(q => q.QuestionPartViewChildren).ThenInclude(q2 => q2.QuestionPart).ThenInclude(qp => qp.QuestionConditionalsSource)
                .Include(s => s.SurveyViews).ThenInclude(v => v.QuestionPartViews).ThenInclude(q => q.QuestionPartViewChildren).ThenInclude(q => q.QuestionPartViewChildren).ThenInclude(q2 => q2.QuestionPart).ThenInclude(qp => qp.QuestionConditionalsTarget)
                .Include(s => s.SurveyViews).ThenInclude(v => v.QuestionPartViews).ThenInclude(q => q.QuestionPartViewChildren).ThenInclude(q => q.QuestionPartViewChildren).ThenInclude(q2 => q2.QuestionPart).ThenInclude(qp => qp.QuestionOptionConditionalsSource)
                .Include(s => s.SurveyViews).ThenInclude(v => v.QuestionPartViews).ThenInclude(q => q.QuestionPartViewChildren).ThenInclude(q2 => q2.QuestionPart).ThenInclude(qp => qp.QuestionConditionalsSource)
                .Include(s => s.SurveyViews).ThenInclude(v => v.QuestionPartViews).ThenInclude(q => q.QuestionPartViewChildren).ThenInclude(q2 => q2.QuestionPart).ThenInclude(qp => qp.QuestionConditionalsTarget)
                .Include(s => s.SurveyViews).ThenInclude(v => v.QuestionPartViews).ThenInclude(q => q.QuestionPartViewChildren).ThenInclude(q2 => q2.QuestionPart).ThenInclude(qp => qp.QuestionOptionConditionalsSource)
                .Include(s => s.SurveyViews).ThenInclude(v => v.QuestionPartViews).ThenInclude(q => q.QuestionPartViewChildren).ThenInclude(q => q.QuestionPartViewChildren).ThenInclude(q2 => q2.QuestionPart).ThenInclude(qp => qp.QuestionConfigurations).ThenInclude(qc => qc.QuestionConfigurationLabels)
                .Include(s => s.SurveyViews).ThenInclude(v => v.QuestionPartViews).ThenInclude(q => q.QuestionPartViewChildren).ThenInclude(q => q.QuestionPartViewChildren).ThenInclude(q2 => q2.QuestionPart).ThenInclude(qp => qp.QuestionOptions).ThenInclude(qo => qo.QuestionOptionLabels)
                .SingleOrDefaultAsync();

            return result;
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

        public bool QuestionNameIsUnique(int surveyId, string name, string oldName)
        {
            if (name == oldName)
            {
                return true;
            }

            var surveyViewIds = _appContext.Surveys
                .Where(s => s.Id == surveyId)
                .SelectMany(s => s.SurveyViews)
                .Select(v => v.Id)
                .ToList();

            var pages = _appContext.QuestionPartViews
                .Where(v => surveyViewIds.Contains(v.SurveyView.Id))
                .Include(qpv => qpv.QuestionPart)
                .Include(qpv => qpv.QuestionPartViewChildren).ThenInclude(qpv => qpv.QuestionPartViewChildren).ThenInclude(qpv => qpv.QuestionPart)
                .Include(qpv => qpv.QuestionPartViewChildren).ThenInclude(qpv => qpv.QuestionPart)
                .ToList();

            var qpartNames = this.GetQuestionPartNames(pages);
            return !qpartNames.Contains(name);
        }

        private List<string> GetQuestionPartNames(List<QuestionPartView> partviews)
        {
            List<string> qpartnames = new List<string>();

            foreach (var partview in partviews)
            {
                if (partview.QuestionPart != null)
                {
                    qpartnames.Add(partview.QuestionPart.Name);
                }
                else
                {
                    /*foreach (var child in partview.QuestionPartViewChildren)
                    {
                        if (child.QuestionPart != null)
                        {
                            qpartnames.Add(child.QuestionPart.Name);
                        }
                        else
                        {
                            foreach (var subchild in child.QuestionPartViewChildren)
                            {
                                qpartnames.Add(subchild.QuestionPart.Name);
                            }
                        }
                    }*/
                    qpartnames.AddRange(this.GetQuestionPartNames(partview.QuestionPartViewChildren.ToList()));
                }
            }
            return qpartnames.Distinct().ToList();
        }
    }
}