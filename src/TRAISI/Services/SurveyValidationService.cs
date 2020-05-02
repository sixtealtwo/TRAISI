using System.Collections;
using System.Collections.Generic;
using Traisi.Models.Surveys.Validation;
using Traisi.Data.Models.Surveys;
using Traisi.Services.Interfaces;

namespace Traisi.Services
{
    /// <summary>
    /// 
    /// /// </summary>
    public class SurveyValidationService : ISurveyValidationService
    {
        public SurveyValidationService() {

        }

        public SurveyLogicError GetSurveyLogicError(SurveyResponse response, SurveyRespondent respondent)
        {
            throw new System.NotImplementedException();
        }

        public List<SurveyLogicError> ListSurveyLogicErrors(Survey survey, SurveyRespondent respondent)
        {
            throw new System.NotImplementedException();
        }

        public bool ValidateSurveyResponse(SurveyResponse response)
        {
            throw new System.NotImplementedException();
        }
    }
}