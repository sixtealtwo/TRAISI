
using System.Collections.Generic;
using Traisi.Models.Surveys.Validation;
using Traisi.Data.Models.Surveys;
using Traisi.Services.Interfaces;
using Traisi.Data;
using System.Linq;

namespace Traisi.Services
{
    /// <summary>
    /// 
    /// /// </summary>
    public class SurveyValidationService : ISurveyValidationService
    {
        private IUnitOfWork _unitOfWork;
        public SurveyValidationService(IUnitOfWork unitOfWork)
        {
            this._unitOfWork = unitOfWork;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="response"></param>
        /// <param name="respondent"></param>
        /// <returns></returns>
        public SurveyLogicError GetSurveyLogicError(SurveyResponse response, SurveyRespondent respondent)
        {
            throw new System.NotImplementedException();
        }

        public List<SurveyLogicError> ListSurveyLogicErrors(Survey survey, SurveyRespondent respondent)
        {
            throw new System.NotImplementedException();
        }

        /// <summary>
        /// Validates the current response and its response value for any violations of survey
        /// control logic.
        /// </summary>
        /// <param name="response"></param>
        /// <returns></returns>
        public List<SurveyLogicError> ValidateSurveyResponse(SurveyResponse response)
        {
            return new List<SurveyLogicError>();
        }
    }
}