using System.Collections.Generic;
using DAL;
using DAL.Models.Surveys;
using DAL.Repositories.Interfaces;
using Moq;


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
            var mock = new Mock<IUnitOfWork>();
            mock.SetupProperty( p => p.Surveys, CreateSurveyRepository());

            return mock.Object;
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
                    Title = "Survey Title",
                    IsActive = true,
                    IsOpen = true
                },
                new Survey() {
                    Id = 2,
                    Name = "Test Survey 2",
                    Title = "Survey Title",
                    IsActive = true,
                    IsOpen = true
                },new Survey() {
                    Id = 3,
                    Name = "Test Survey 3",
                    Title = "Survey Title",
                    IsActive = true,
                    IsOpen = true
                },
                new Survey() {
                    Id = 4,
                    Name = "Test Survey 4",
                    Title = "Survey Title",
                    IsActive = true,
                    IsOpen = true
                }

            };
            var mock = new Mock<ISurveyRepository>();
            mock.Setup(m => m.GetAllAsync()).ReturnsAsync(moqSurveys);
            mock.Setup( m => m.GetAsync(It.IsAny<int>())).
            ReturnsAsync((int i) => moqSurveys.Find(s => s.Id == i));

            mock.Setup( m=> m.CountAsync()).ReturnsAsync(moqSurveys.Count);
            mock.Setup( m=> m.Remove(It.IsAny<Survey>())).Callback<Survey>((s) => moqSurveys.Remove(s));

            mock.Setup( m=> m.Update(It.IsAny<Survey>())).Callback<Survey>((s) => moqSurveys.Find(p => p.Id == s.Id));

            return mock.Object;
        }
    }
}
