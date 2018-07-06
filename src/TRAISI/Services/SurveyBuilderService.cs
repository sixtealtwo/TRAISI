using DAL;
using DAL.Models.Surveys;

namespace TRAISI.Services
{
    public class SurveyBuilderService
    {
        private IUnitOfWork _unitOfWork;
        public SurveyBuilderService(IUnitOfWork unitOfWork)
        {
            this._unitOfWork = unitOfWork;

        }


        /// <summary>
        /// Adds a new view to the specified survey
        /// </summary>
        /// <param name="survey"></param>
        public void AddSurveyView(Survey survey)
        {
            var surveyView = new SurveyView();
            survey.SurveyViews.Add(surveyView);
        }

        public void RemoveSurveyView(Survey survey, SurveyView view)
        {
            survey.SurveyViews.Remove(view);
        }
    }
}