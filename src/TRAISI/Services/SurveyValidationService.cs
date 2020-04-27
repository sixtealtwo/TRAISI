using System.Collections;
using System.Collections.Generic;
using Traisi.Models.Surveys.Validation;
using TRAISI.Data.Models.Surveys;
using TRAISI.Services.Interfaces;

namespace TRAISI.Services
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