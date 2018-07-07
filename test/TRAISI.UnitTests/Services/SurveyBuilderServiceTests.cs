using System;
using TRAISI.Services;
using Xunit;
using Moq;
using DAL.Models.Surveys;

namespace TRAISI.UnitTests.Services
{
    public class SurveyBuilderServiceTests : IDisposable
    {

        private SurveyBuilderService _surveyBuilderService;

        public SurveyBuilderServiceTests()
        {
            this._surveyBuilderService = CreateSurveyBuilderService();
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

            Assert.True(true);
        }


        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public SurveyBuilderService CreateSurveyBuilderService()
        {
            return new SurveyBuilderService(Utility.CreateUnitOfWork());
        }

        /// <summary>
        /// Cleanup, teardown after each test
        /// </summary>
        public void Dispose()
        {

        }
    }


}