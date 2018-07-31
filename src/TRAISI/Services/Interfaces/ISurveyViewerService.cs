using System;
using System.Threading.Tasks;
using DAL.Models;
using DAL.Models.Questions;
using DAL.Models.Surveys;
using TRAISI.ViewModels;

namespace TRAISI.Services.Interfaces
{
    public interface ISurveyViewerService
    {
        /// <summary>
        /// Retrieves a QuestionPartView at index number in the SurveyView
        /// </summary>
        /// <param name="view"></param>
        /// <param name="number"></param>
        /// <returns></returns>
        QuestionPartView GetQuestion(SurveyView view, int number);


        /// <summary>
        /// 
        /// </summary>
        /// <param name="surveyId"></param>
        /// <param name="shortcode"></param>
        /// <returns></returns>
        Task<ApplicationUser> SurveyLogin(int surveyId, string shortcode);


        Task<SurveyView> GetDefaultSurveyView(int surveyId);


        SurveyView GetDefaultSurveyView(Survey survey);

        ///
        bool AuthorizeSurveyUser(Survey survey, string shortcode);

        Task<SurveyWelcomeViewModel> GetSurveyWelcomeView(string name);

    }
}