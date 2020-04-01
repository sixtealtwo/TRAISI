using System;
using TRAISI.Services;
using Xunit;
using Moq;
using TRAISI.Data.Models.Surveys;
using TRAISI.Data;
using TRAISI.Data.Models.Questions;
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