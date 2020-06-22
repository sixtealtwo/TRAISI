
using System.Collections.Generic;
using Traisi.Models.Surveys.Validation;
using Traisi.Data.Models.Surveys;
using Traisi.Services.Interfaces;
using Traisi.Data;
using System.Linq;
using System.Threading.Tasks;
using Traisi.Data.Models.ResponseTypes;
using Traisi.Sdk;
using Traisi.Sdk.Interfaces;
using Traisi.Sdk.Enums;
using Traisi.ViewModels.SurveyViewer;
using Newtonsoft.Json.Linq;

namespace Traisi.Services
{
    /// <summary>
    /// 
    /// </summary>
    public class SurveyValidationService : ISurveyValidationService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IQuestionTypeManager _questionManager;
        public SurveyValidationService(IUnitOfWork unitOfWork, IQuestionTypeManager questions)
        {
            this._unitOfWork = unitOfWork;
            this._questionManager = questions;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="response"></param>
        /// <param name="respondent"></param>
        /// <returns></returns>
        public async Task<List<SurveyValidationError>> ListSurveyLogicErrorsForResponse(SurveyResponse response, SurveyRespondent respondent)
        {
            // find the survey logic referencing this response
            var logicTree = await this._unitOfWork.SurveyLogic.GetSurveyLogicExpressionTreeForQuestionAsync(response.QuestionPart);
            var uniqueRoots = logicTree.Select(s => s.Root).Distinct().ToList();
            var results = new List<SurveyValidationError>();
            if (uniqueRoots.Count > 0)
            {
                List<int> questionIds = new List<int>();
                GetResponseValueIdsForLogicTree(uniqueRoots[0], questionIds);
                var responses = await this._unitOfWork.SurveyResponses.ListSurveyResponsesForQuestionsAsync(questionIds, respondent);

                // remove existing
                responses.RemoveAll(x => x.QuestionPart.Id == response.QuestionPart.Id);

                // add upate to date response
                responses.Add(response);
                var result = EvaluateExpressionTree(uniqueRoots[0], responses);

                if (result)
                {
                    var logicError = new SurveyValidationError()
                    {
                        ValidationState = ValidationState.Invalid,
                        Messages = uniqueRoots[0].ValidationMessages,

                    };
                    results.Add(logicError);
                }

            }
            return results;

        }

        /// <summary>
        /// Returns the list of question part ids that are required for a logic tree expression
        /// </summary>
        /// <param name="logicTree"></param>
        /// <param name="ids"></param>
        private void GetResponseValueIdsForLogicTree(SurveyLogic logicTree, List<int> ids)
        {

            if (logicTree.QuestionId > 0)
            {
                ids.Add(logicTree.QuestionId.Value);
            }
            foreach (var child in logicTree.Expressions)
            {
                GetResponseValueIdsForLogicTree(child, ids);
            }

        }

        private bool EvaluateExpressionTree(SurveyLogic logicGroup, List<SurveyResponse> responses)
        {
            var expressionResult = logicGroup.Expressions.Where(x => x.QuestionId > 0).All(x =>
            {
                var response = responses.Where(r => r.QuestionPart.Id == x.QuestionId).FirstOrDefault();
                return EvaluateExpression(response, x);
            });
            var childResults = logicGroup.Expressions.Where(x => x.Operator != null).All(
                x => EvaluateExpressionTree(x, responses)
            );
            return expressionResult && childResults;

        }

        private bool EvaluateExpression(SurveyResponse response, SurveyLogic compareValue)
        {
            // get definition
            var questionDefinition = _questionManager.QuestionTypeDefinitions[response.QuestionPart.QuestionType];

            switch (questionDefinition.ResponseType)
            {
                case QuestionResponseType.String:
                    return EvaluateTextComparison(response, compareValue);
                case QuestionResponseType.Number:
                    return true;
                case QuestionResponseType.OptionSelect:
                    return EvaluateOptionSelect(response, compareValue);
                default:
                    return true;
            }
        }


        private bool EvaluateOptionSelect(SurveyResponse response, SurveyLogic logic)
        {
            JToken[] jvalues = JToken.Parse(logic.Value).ToArray();
            // convert values to a list of strings
            List<string> values = new List<string>();
            foreach (var v in jvalues)
            {
                values.Add(v.Value<string>());
            }
            if (logic.Operator == SurveyLogicOperator.AllOf)
            {
                return response.ResponseValues.All(x =>
                {
                    return values.Contains((x as OptionSelectResponse).Code);
                });
            }
            else if (logic.Operator == SurveyLogicOperator.AnyOf)
            {
                return response.ResponseValues.Any(x =>
                {
                    return values.Contains((x as OptionSelectResponse).Code);
                });
            }
            else if (logic.Operator == SurveyLogicOperator.NoneOf)
            {
                return !response.ResponseValues.Any(x =>
                {
                    return values.Contains((x as OptionSelectResponse).Code);
                });
            }

            return true;
        }

        private bool EvaluateTextComparison(SurveyResponse response, SurveyLogic compareValue)
        {
            if (compareValue.Operator == SurveyLogicOperator.Equals)
            {
                return (response.ResponseValues[0] as StringResponse).Value.Equals(compareValue.Value);
            }
            else if (compareValue.Operator == SurveyLogicOperator.Contains)
            {
                return (response.ResponseValues[0] as StringResponse).Value.Contains(compareValue.Value);
            }
            else
            {
                return true;
            }
        }

        public List<SurveyValidationError> ListSurveyLogicErrorsForSurvey(Survey survey, SurveyRespondent respondent)
        {
            throw new System.NotImplementedException();
        }

        /// <summary>
        /// Validates the current response and its response value for any violations of survey
        /// control logic.
        /// </summary>
        /// <param name="response"></param>
        /// <returns></returns>
        public async Task<List<SurveyValidationError>> ValidateSurveyResponse(SurveyResponse response)
        {
            return new List<SurveyValidationError>();
        }
    }
}