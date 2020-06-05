using System.Collections.Concurrent;
using System.Collections.Generic;
using Traisi.Models.Surveys.Validation;

namespace Traisi.ViewModels.SurveyViewer
{
    public class SurveyViewerValidationStateViewModel
    {

        public ValidationStateViewModel QuestionValidationState { get; set; }
        public ValidationStateViewModel SurveyLogicValidationState { get; set; }

    }

    public class ValidationStateViewModel
    {
        public ValidationState ValidationState { get; set; }
        public List<string> ErrorMessages { get; set; } = new List<string>();
    }



}