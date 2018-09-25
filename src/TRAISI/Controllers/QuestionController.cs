using System;
using Microsoft.AspNetCore.Mvc;
using TRAISI.SDK;
using TRAISI.SDK.Interfaces;
using DAL;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using System.IO;

namespace TRAISI.Controllers
{
    [Route("api/[controller]")]
    public class QuestionController : Controller
    {
        private IQuestionTypeManager _questionTypeManager;

        /// <summary>
        /// Inject the QuestionTypeManager service
        /// </summary>
        /// <param name="questionTypeManager"></param>
        public QuestionController(IQuestionTypeManager questionTypeManager)
        {
            this._questionTypeManager = questionTypeManager;
        }

        /// <summary>
        /// Returns the bundled module.js client code for the requested
        /// question definition.
        /// </summary>
        /// <param name="questionType"></param>
        /// <returns></returns>
        [HttpGet("client-code/{questionType}")]
        public async Task<ActionResult> ClientCode(string questionType)
        {
            try
            {
                if (!_questionTypeManager.QuestionTypeDefinitions.Keys.Contains(questionType))
                {
                     return new NotFoundResult(); 
                }

                var questionTypeDefinition =
                    _questionTypeManager.QuestionTypeDefinitions[questionType];


                if (questionTypeDefinition.CodeBundleName == null)
                {
                    return File(QuestionTypeDefinition.ClientModules.Values.ToList()[0], "application/javascript");
                }
                else
                {

                    var path = Path.Combine("development", questionTypeDefinition.CodeBundleName);
                    if (System.IO.File.Exists(path))
                    {
                        return File(await System.IO.File.ReadAllBytesAsync(path), "application/javascript");
                    }
                }

                return File(
                    QuestionTypeDefinition.ClientModules[
                        QuestionTypeDefinition.ClientModules.Keys
                            .FirstOrDefault(k => k.EndsWith(questionTypeDefinition.CodeBundleName,
                                StringComparison.InvariantCultureIgnoreCase))],
                    "application/javascript");
            }
            catch(Exception e)
            {
                //return error if not found
                return new BadRequestObjectResult(e);
            }
        }


        [HttpGet("question-types")]
        [Produces(typeof(List<QuestionTypeDefinition>))]
        public IEnumerable<QuestionTypeDefinition> QuestionTypes()
        {
            var questionTypes = this._questionTypeManager.QuestionTypeDefinitions;
            return questionTypes.Values;
        }
    }
}