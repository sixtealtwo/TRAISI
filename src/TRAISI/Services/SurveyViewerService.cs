using System.Threading.Tasks;
using DAL;
using DAL.Models.Questions;
using DAL.Models.Surveys;
using TRAISI.Services.Interfaces;

namespace TRAISI.Services
{
    public class SurveyViewerService : ISurveyViewerService
    {
        private IUnitOfWork _unitOfWork;
        public QuestionPartView GetQuestion(SurveyView view, int number)
        {
            throw new System.NotImplementedException();
        }

        public bool SurveyLogin(Survey survey, string shortcode)
        {
            throw new System.NotImplementedException();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="survey"></param>
        /// <param name="viewId"></param>
        /// <returns></returns>
        public async Task<SurveyView> GetSurveyView(Survey survey, int viewId)
        {
            return await this._unitOfWork.SurveyViews.GetAsync(viewId);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="unitOfWork"></param>
        public SurveyViewerService(IUnitOfWork unitOfWork)
        {
            this._unitOfWork = unitOfWork;
        }
    }
}