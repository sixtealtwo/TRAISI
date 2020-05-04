
using System.Collections.Generic;
using Traisi.Data.Models.Extensions;
using Traisi.Data.Models.Surveys;

namespace Traisi.Models.Surveys.Validation
{

    public class SurveyResponseValidationState
    {

        public bool IsValid { get; set; }
        public List<SurveyLogicError> Errors { get; set; } = new List<SurveyLogicError>();
    }

    public class SurveyLogicError
    {

        public LabelCollection<Label> Messages { get; set; } = new LabelCollection<Label>();

        public SurveyLogicError()
        {

        }

    }

}