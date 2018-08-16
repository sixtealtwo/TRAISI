using System;
using System.Threading.Tasks;
using DAL.Models;
using DAL.Models.Questions;
using DAL.Models.Surveys;
using TRAISI.ViewModels;
using TRAISI.ViewModels.SurveyViewer;
using TRAISI.ViewModels.SurveyViewer.Enums;

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
        Task<(bool loginSuccess, ApplicationUser user)> SurveyLogin(int surveyId, string shortcode);

        Task<QuestionOptionsViewModel> GetQuestionOptions(int questionId);


        Task<SurveyView> GetDefaultSurveyView(int surveyId);


        SurveyView GetDefaultSurveyView(Survey survey);

        ///
        bool AuthorizeSurveyUser(Survey survey, string shortcode);

        Task<SurveyStartViewModel> GetSurveyWelcomeView(string name);


        Task<SurveyViewTermsAndConditionsViewModel> GetSurveyTermsAndConditionsText(int surveyId,
        string language = null,
        SurveyViewType viewType = SurveyViewType.CatiView);

    }
}