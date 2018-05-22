using System.Collections.Generic;
using System.Threading.Tasks;
using DAL;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TRAISI.SDK;

namespace TRAISI.Controllers {
    [Authorize]
    [Route ("api/[controller]")]
    public class SurveyBuilderController {
        private IUnitOfWork _unitOfWork;

        private QuestionTypeManager _questionTypeManager;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="httpUnitOfWork"></param>
        public SurveyBuilderController (HttpUnitOfWork httpUnitOfWork,
        QuestionTypeManager questionTypeManager) {
            this._unitOfWork = httpUnitOfWork;
            this._questionTypeManager = questionTypeManager;
        }

        [HttpGet]
        [Produces(typeof(List<QuestionTypeDefinition>))]
        public IEnumerable<QuestionTypeDefinition> QuestionTypes () {
            return this._questionTypeManager.QuestionTypeDefinitions;
        }
    }
}