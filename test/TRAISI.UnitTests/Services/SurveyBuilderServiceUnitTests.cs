using System;
using TRAISI.Services;
using Xunit;
using Moq;
using TRAISI.Data.Models.Surveys;
using TRAISI.Data;
using TRAISI.Data.Models.Questions;
using TRAISI.Services.Interfaces;
using System.Collections.Generic;
using System.Linq;

namespace TRAISI.UnitTests.Services
{
    public class SurveyBuilderServiceUnitTests : IDisposable
    {
        private ISurveyBuilderService _surveyBuilderService;

        public SurveyBuilderServiceUnitTests()
        {
            this._surveyBuilderService = new SurveyBuilderService(Utility.CreateUnitOfWork(), Utility.CreateQuestionTypeManager());
        }



        [Fact]
        public void TestAddSurveyView()
        {
            Survey survey = new Survey()
            {
                //     Title = "Test Survey",
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
                //     Title = "Test Survey",

            };
            Assert.True(survey.SurveyViews.Count == 0);
            var view = this._surveyBuilderService.AddSurveyView(survey, "View 1");
            Assert.True(survey.SurveyViews.Count == 1);
            this._surveyBuilderService.RemoveSurveyView(survey, view.Id);
            Assert.True(survey.SurveyViews.Count == 0);
        }

        [Fact]
        public void AddSurveyLogic_ReturnsSingleSurveyLogic()
        {
            Survey survey = new Survey();
            SurveyLogic logic1 = new SurveyLogic()
            {
                Id = 1,
                ValidationMessages = new List<SurveyLogicLabel> {
                    new SurveyLogicLabel() {
                       Value="ValidationMessage1"}
                },
                Condition = SurveyLogicCondition.And,
                Expressions = new List<SurveyLogicExpression> {
                    new SurveyLogicExpression() {
                        Id = 1,
                        Operator = SurveyLogicOperator.Equals,
                        Value = "TestValue1"
                    }
                }
            };
            this._surveyBuilderService.AddSurveyLogic(survey, logic1);
            Assert.Equal(survey.SurveyLogic.First(), logic1);
        }

        [Fact]
        public void AddAndRemoveSurveyLogic_ReturnsEmptySurveyLogic()
        {
            Survey survey = new Survey();
            SurveyLogic logic1 = new SurveyLogic()
            {
                Id = 1,
                ValidationMessages = new List<SurveyLogicLabel> {
                    new SurveyLogicLabel() {
                       Value="ValidationMessage1"}
                },
                Condition = SurveyLogicCondition.And,
                Expressions = new List<SurveyLogicExpression> {
                    new SurveyLogicExpression() {
                        Id = 1,
                        Operator = SurveyLogicOperator.Equals,
                        Value = "TestValue1"
                    }
                }
            };
            SurveyLogic logic2 = new SurveyLogic()
            {
                Id = 2,
                ValidationMessages = new List<SurveyLogicLabel> {
                    new SurveyLogicLabel() {
                       Value="ValidationMessage1"}
                },
                Condition = SurveyLogicCondition.And,
                Expressions = new List<SurveyLogicExpression> {
                    new SurveyLogicExpression() {
                        Id = 2,
                        Operator = SurveyLogicOperator.Equals,
                        Value = "TestValue1"
                    }
                }
            };
            this._surveyBuilderService.AddSurveyLogic(survey, logic1);
            this._surveyBuilderService.AddSurveyLogic(survey, logic2);
            Assert.Equal(survey.SurveyLogic.Count, 2);
            this._surveyBuilderService.RemoveSurveyLogic(survey, logic1);
            Assert.Equal(survey.SurveyLogic.Count, 1);
            //remove same survey logic (should have no effect)
            this._surveyBuilderService.RemoveSurveyLogic(survey, logic1);
            Assert.Equal(survey.SurveyLogic.Count, 1);
            this._surveyBuilderService.RemoveSurveyLogic(survey, logic2);
            Assert.Empty(survey.SurveyLogic);
        }

        /// <summary>
        /// Cleanup, teardown after each test
        /// </summary>
        public void Dispose()
        {

        }


    }


}