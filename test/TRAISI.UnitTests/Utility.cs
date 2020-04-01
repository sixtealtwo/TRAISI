using System.Collections.Generic;
using System.ComponentModel;
using TRAISI.Data;
using TRAISI.Data.Models.Surveys;
using TRAISI.Data.Repositories.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using TRAISI.Helpers;
using TRAISI.SDK;
using TRAISI.SDK.Attributes;
using TRAISI.SDK.Enums;
using TRAISI.SDK.Interfaces;

namespace TRAISI.UnitTests
{
    public class Utility
    {

        /// <summary>
        /// Creates a Moq UnitOfWork object for unit testing
        /// </summary>
        /// <returns></returns>
        public static IUnitOfWork CreateUnitOfWork()
        {
            var mock = new Mock<UnitOfWork>(CreateSurveyRepository());
            //mock.SetupProperty( p => p.Surveys, CreateSurveyRepository());

            return mock.Object;
        }
        
        public static IConfiguration CreateConfiguration()
        {
            var mock = new Mock<IConfiguration>();
            return mock.Object;
        }

        /// <summary>
        /// Creates a Moq QuestionTypeManager
        /// </summary>
        /// <returns></returns>
        public static QuestionTypeManager CreateQuestionTypeManager()
        {

            var mock = new Mock<QuestionTypeManager>(null,CreateLoggerFactory());

            Dictionary<string, QuestionTypeDefinition> definitions = new Dictionary<string, QuestionTypeDefinition>();



            var mockSurveyQuestion = new Mock<ISurveyQuestion>();
            mockSurveyQuestion.SetupProperty(p => p.TypeName,"TestQuestionType1");
            mockSurveyQuestion.SetupProperty(p => p.Icon, "IconType1");
            
            TypeDescriptor.AddAttributes(mockSurveyQuestion.Object, new QuestionConfigurationAttribute(ConfigurationValueType.Integer){
                Description = "Description",

            });
            var questionAttribute = new SurveyQuestionAttribute(QuestionResponseType.Integer)
            {
                CustomBuilderView = null,

            };

            QuestionTypeDefinition definition = new QuestionTypeDefinition(mockSurveyQuestion.Object,questionAttribute);

            definitions[definition.TypeName] = definition;



            mock.SetupProperty(p => p.QuestionTypeDefinitions,definitions);

            return mock.Object;
        }

        public static ILoggerFactory CreateLoggerFactory()
        {
            return new LoggerFactory();
            
        }

        /// <summary>
        /// Creates a Moq Survey Repository
        /// </summary>
        /// <returns></returns>
        public static ISurveyRepository CreateSurveyRepository()
        {
            List<Survey> moqSurveys = new List<Survey>() {
                new Survey() {
                    Id = 1,
                    Name = "Test Survey 1",
   //                 Title = "Survey Title",
                    IsActive = true,
                    IsOpen = true
                },
                new Survey() {
                    Id = 2,
                    Name = "Test Survey 2",
               //     Title = "Survey Title",
                    IsActive = true,
                    IsOpen = true
                },new Survey() {
                    Id = 3,
                    Name = "Test Survey 3",
              //      Title = "Survey Title",
                    IsActive = true,
                    IsOpen = true
                },
                new Survey() {
                    Id = 4,
                    Name = "Test Survey 4",
              //      Title = "Survey Title",
                    IsActive = true,
                    IsOpen = true
                }

            };
            var mock = new Mock<ISurveyRepository>();
            mock.Setup(m => m.GetAllAsync()).ReturnsAsync(moqSurveys);
            mock.Setup(m => m.GetAsync(It.IsAny<int>())).
            ReturnsAsync((int i) => moqSurveys.Find(s => s.Id == i));

            mock.Setup(m => m.CountAsync()).ReturnsAsync(moqSurveys.Count);
            mock.Setup(m => m.Remove(It.IsAny<Survey>())).Callback<Survey>((s) => moqSurveys.Remove(s));
            mock.Setup(m => m.Update(It.IsAny<Survey>())).Callback<Survey>((s) => moqSurveys.Find(p => p.Id == s.Id));

            return mock.Object;
        }
    }
}
