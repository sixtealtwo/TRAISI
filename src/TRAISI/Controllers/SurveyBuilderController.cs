using System.Collections.Generic;
using System.Threading.Tasks;
using DAL;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TRAISI.SDK;
using TRAISI.SDK.Interfaces;

namespace TRAISI.Controllers
{
    [Authorize(Authorization.Policies.AccessAdminPolicy)]
    [Route("api/[controller]")]
    public class SurveyBuilderController
    {
        private IUnitOfWork _unitOfWork;

        private IQuestionTypeManager _questionTypeManager;

        /// <summary>
        /// Constructor the controller.
        /// </summary>
        /// <param name="unitOfWork">Unit of work service.</param>
        /// <param name="questionTypeManager">Question type manager service.</param>
        public SurveyBuilderController(IUnitOfWork unitOfWork,
										IQuestionTypeManager questionTypeManager)
        {
            this._unitOfWork = unitOfWork;
            this._questionTypeManager = questionTypeManager;
        }

        [HttpGet("question-types")]
        [Produces(typeof(List<QuestionTypeDefinition>))]
        public IEnumerable<QuestionTypeDefinition> QuestionTypes()
        {
            var questionTypes = this._questionTypeManager.QuestionTypeDefinitions;
            return questionTypes;
        }
    }
}