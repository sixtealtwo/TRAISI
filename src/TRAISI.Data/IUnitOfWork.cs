using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL.Models.Surveys;
using DAL.Repositories.Interfaces;

namespace DAL
{
    public interface IUnitOfWork
    {
        ISurveyRepository Surveys { get; }
        ISurveyPermissionsRepository SurveyPermissions { get; }
        IApiKeysRepository ApiKeys { get; }
        IEmailTemplateRepository EmailTemplates { get; }
        ISiteSurveyTemplateRepository SiteSurveyTemplates { get; }
        IShortcodeRepository Shortcodes { get; }
        IGroupcodeRepository GroupCodes { get; }
        IUserGroupRepository UserGroups { get; }
        IGroupMemberRepository GroupMembers { get; }
        ISurveyViewRepository SurveyViews { get; }
        IQuestionPartRepository QuestionParts { get; }
        IQuestionPartViewRepository QuestionPartViews { get; }
        IWelcomePageLabelRepository WelcomePageLabels { get; }
        IThankYouPageLabelRepository ThankYouPageLabels { get; }
        IRepository<TitlePageLabel> TitlePageLabels { get; }
        ITermsAndConditionsPageLabelRepository TermsAndConditionsPageLabels { get; }
        IScreeningQuestionsLabelRepository ScreeningQuestionsLabels { get; }
        ISurveyResponseRepository SurveyResponses { get; }
        IQuestionOptionRepository QuestionOptions { get; }
        IQuestionConditionalRepository QuestionConditionals { get; }
        IQuestionOptionConditionalRepository QuestionOptionConditionals { get; }
        ISurveyRespondentRepository SurveyRespondents { get; }
        ISurveyRespondentGroupRepository SurveyRespondentGroups { get; }
        ISurveyUserRepository SurveyUsers { get; }

        int SaveChanges();
        Task<int> SaveChangesAsync();

        void EnableAutoDetectChanges();

        void DisableAutoDetectChanges();
    }
}