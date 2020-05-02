using System.Collections.Generic;
using System.Threading.Tasks;
using Traisi.Data.Models.Questions;
using Traisi.Data.Models.Surveys;
using Traisi.Data.Core;
using Traisi.Sdk;
using Microsoft.AspNetCore.Http;
using Traisi.Data.Models;
using System.Collections;
using Traisi.Models.Surveys.Validation;

namespace Traisi.Services.Interfaces
{
    public interface ISurveyValidationService 
    {
        public bool ValidateSurveyResponse(SurveyResponse response);

        public SurveyLogicError GetSurveyLogicError(SurveyResponse response, SurveyRespondent respondent);

        public List<SurveyLogicError> ListSurveyLogicErrors(Survey survey, SurveyRespondent respondent);
    }
}
