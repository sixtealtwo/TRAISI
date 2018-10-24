using DAL.Core;

namespace TRAISI.ViewModels.SurveyViewer
{
    public class SurveyViewConditionalViewModel
    {
        public QuestionConditionalType ConditionalType { get; set; }

        public int SourceQuestionId { get; set; }

        public int TargetQuestionId { get; set; }
    }
}