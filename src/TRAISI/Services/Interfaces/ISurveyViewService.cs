using DAL.Models.Questions;
using DAL.Models.Surveys;

namespace TRAISI.Services.Interfaces
{
    public interface ISurveyViewService
    {
        /// <summary>
        /// Retrieves a QuestionPartView at index number in the SurveyView
        /// </summary>
        /// <param name="view"></param>
        /// <param name="number"></param>
        /// <returns></returns>
        QuestionPartView GetQuestion(SurveyView view, int number);

    }
}