using System;
using TRAISI.Services;
using Xunit;
using Moq;
using DAL.Models.Surveys;
using DAL;
using DAL.Models.Questions;

namespace TRAISI.UnitTests.Services
{
    public class SurveyBuilderServiceTests : IDisposable
    {

        private SurveyBuilderService _surveyBuilderService;

        private IUnitOfWork _unitOfWork;

        public SurveyBuilderServiceTests()
        {
            this._surveyBuilderService = CreateSurveyBuilderService();
            this._unitOfWork = Utility.CreateUnitOfWork();
        }

        [Fact]
        public void TestAddSurveyView()
        {
            Survey survey = new Survey()
            {
                Title = "Test Survey",

            };

            Assert.True(survey.SurveyViews.Count == 0);

            var view = this._surveyBuilderService.AddSurveyView(survey, "View 1");

            Assert.True(survey.SurveyViews.Count == 1);

            Assert.True(view.ViewName == "View 1");

            view = this._surveyBuilderService.AddSurveyView(survey, "View 2");

            Assert.True(view.ViewName == "View 2");

            Assert.True(survey.SurveyViews.Count == 2);
        }

        [Fact]
        public void TestRemoveSurveyView()
        {
            Survey survey = new Survey()
            {
                Title = "Test Survey",

            };

            Assert.True(survey.SurveyViews.Count == 0);

            var view = this._surveyBuilderService.AddSurveyView(survey, "View 1");

            Assert.True(survey.SurveyViews.Count == 1);


            this._surveyBuilderService.RemoveSurveyView(survey, view.Id);

            Assert.True(survey.SurveyViews.Count == 0);


        }

        [Fact]
        public void Test_SetQuestionConfiguration()
        {
            Survey survey = new Survey()
            {
                Title = "Test Survey",

            };

            var view = this._surveyBuilderService.AddSurveyView(survey,"View");

            var questionPart = new QuestionPart();

            this._surveyBuilderService.AddQuestionPart(view,new DAL.Models.Questions.QuestionPart(), null);

            this._surveyBuilderService.SetQuestionConfiguration(questionPart,"cat","dog");

            Assert.True(true);


        }
        
        [Fact]
        public void Test_AddQuestionPart()
        {
            Assert.True(true);
        }


        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public SurveyBuilderService CreateSurveyBuilderService()
        {
            return new SurveyBuilderService(Utility.CreateUnitOfWork(), new Helpers.QuestionTypeManager(null, Utility.CreateLoggerFactory()));
        }



        /// <summary>
        /// Cleanup, teardown after each test
        /// </summary>
        public void Dispose()
        {

        }
    }


}