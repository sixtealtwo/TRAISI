using System;
using TRAISI.Services;
using Xunit;
using Moq;
using DAL.Models.Surveys;
using DAL;
using DAL.Models.Questions;
using TRAISI.Helpers;

namespace TRAISI.UnitTests.Services
{
    public class QuestionTypeManagerTests
    {

        private QuestionTypeManager _questions;
        public QuestionTypeManagerTests()
        {
            this._questions = Utility.CreateQuestionTypeManager();
        }

        [Fact]
        public void Test_ListQuestionSlots()
        {
            
        }


    }
}