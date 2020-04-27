using System.Collections.Generic;
using System.Threading.Tasks;
using TRAISI.Data.Models.Questions;
using TRAISI.Data.Models.Surveys;
using TRAISI.Data.Core;
using TRAISI.SDK;
using Microsoft.AspNetCore.Http;
using TRAISI.Data.Models;
using System.Collections;
using Traisi.Models.Surveys.Validation;

namespace TRAISI.Services.Interfaces
{
    public interface ISurveyValidationService 
    {
        public bool ValidateSurveyResponse(SurveyResponse response);

        public SurveyLogicError GetSurveyLogicError(SurveyResponse response, SurveyRespondent respondent);

        public List<SurveyLogicError> ListSurveyLogicErrors(Survey survey, SurveyRespondent respondent);
    }
}
