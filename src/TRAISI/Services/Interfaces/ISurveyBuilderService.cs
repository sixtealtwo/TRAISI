using System.Collections.Generic;
using System.Threading.Tasks;
using TRAISI.Data.Models.Questions;
using TRAISI.Data.Models.Surveys;
using TRAISI.Data.Core;
using TRAISI.SDK;
using Microsoft.AspNetCore.Http;

namespace TRAISI.Services.Interfaces
{
    public interface ISurveyBuilderService
    {

        SurveyView AddSurveyView(Survey survey, string viewName);

        void RemoveSurveyView(Survey survey, int id);

        void DuplicateSurveyViewStructure(SurveyView sourceView, SurveyView targetView, string language);

        /// <summary>
        /// Deletes a CAIT translation from a view. Returns true if CATI view has other languages.
        /// </summary>
        /// <param name="surveyView"></param>
        /// <param name="language"></param>
        /// <returns>True if CATI view has other languages.  False if empty</returns>
        bool DeleteCATITranslation(SurveyView surveyView, string language);

        QuestionConfiguration SetQuestionConfiguration(QuestionPart questionPart, string name, object value);

        QuestionOption SetQuestionOptionLabel(QuestionPart questionPart, int id, string code, string name, string value, string language);

        List<(string, string, string)> ImportQuestionOptions(QuestionPart questionPart, string name, string language, IFormFile fileStream);

        QuestionOption AddQuestionOption(QuestionPart questionPart, string code, string name, string value, string language);

        void RemoveQuestionConfiguration(QuestionPart questionPart, string name);

        void RemoveQuestionOption(QuestionPart questionPart, int optionId, string language = null);

        void ReOrderOptions(QuestionPart part, List<QuestionOption> newOrder);

        void AddSurveyPage(SurveyView view, QuestionPartView newPage);

        void RemoveSurveyPage(SurveyView view, int pageId);

        void ReOrderPages(SurveyView view, List<QuestionPartView> newOrder);

        QuestionPartView AddQuestionPart(SurveyView view, QuestionPart part, QuestionTypeDefinition definition, int position);

        void AddQuestionPartChild(QuestionPart part, QuestionTypeDefinition definition);

        void SetSurveyTitle(Survey s, string title, string language);

        IEnumerable<QuestionConfiguration> GetQuestionConfigurations(QuestionPart questionPart);

        IEnumerable<QuestionOption> GetQuestionOptions(QuestionPart questionPart, string language);

        void AddQuestionPartView(QuestionPartView ParentQuestionPartView, QuestionPartView ChildQuestionPartView);

        QuestionPartView AddQuestion(SurveyView view, QuestionTypeDefinition definition, int position = -1);


        void SetQuestionPartViewLabel(QuestionPartView qpv, string text, string language = null);

        void UpdateQuestionPartViewOptions(QuestionPartView qpv, bool isOptional, bool isHousehold, string repeatSourceQuestionName, string icon);

        void UpdateQuestionPartName(int surveyId, QuestionPart qp, string newName);

        void RemoveQuestionPartView(QuestionPartView questionPartView, int childQuestionPartViewId, bool transfer);

        void ReOrderQuestions(QuestionPartView questionPartView, List<QuestionPartView> newOrder);

        void ValidateConditionals(SurveyView structure, int questionPartViewMovedId);

        // void ValidateHouseholdFlag(SurveyView structure, int questionPartViewModedId);

        void SetQuestionConditionals(QuestionPart question, List<QuestionConditional> conditionals);

        void SetQuestionOptionConditionals(QuestionPart question, List<QuestionOptionConditional> conditionals);
        List<QuestionPartView> GetPageStructureWithOptions(int surveyId, string surveyViewName);

        void UpdateQuestionConditionals(QuestionPartView question, QuestionConditionalOperator[] conditionalOperators);

        void SetSurveyLogic(Survey survey, List<SurveyLogic> logics);

    }
}