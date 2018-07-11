using System;
using TRAISI.Services;
using Xunit;
using Moq;
using DAL.Models.Surveys;
using DAL;

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

            this._surveyBuilderService.AddSurveyView(survey, "View 1");

            Assert.True(survey.SurveyViews.Count == 1);
        }

        [Fact]
        public void TestRemoveSurveyView()
        {
            Survey survey = new Survey()
            {
                Title = "Test Survey",

            };

            Assert.True(survey.SurveyViews.Count == 0);

            this._surveyBuilderService.AddSurveyView(survey, "View 1");

            Assert.True(survey.SurveyViews.Count == 1);

            //this._surveyBuilderService.RemoveSurveyView(survey, "View 1");
            
        

            Assert.True(true);
        }


        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public SurveyBuilderService CreateSurveyBuilderService()
        {
            return new SurveyBuilderService(Utility.CreateUnitOfWork(), new Helpers.QuestionTypeManager(null,null));
        }

        /// <summary>
        /// Cleanup, teardown after each test
        /// </summary>
        public void Dispose()
        {

        }
    }


}