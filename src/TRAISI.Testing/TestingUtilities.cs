using System.Security.Claims;
using System.Threading.Tasks;
using DAL;
using DAL.Core.Interfaces;
using DAL.Models.Surveys;
using DAL.Repositories.Interfaces;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Moq;
using System.Collections.Generic;
namespace TRAISI.Testing
{
    public class TestingUtilities
    {

        private static IUnitOfWork _unitOfWork;


        /// <summary>
        /// 
        /// </summary>
        public static IUnitOfWork GetUnitOfWork()
        {
            if (_unitOfWork == null)
            {
                var mock = new Mock<ApplicationDbContext>();
                _unitOfWork = new UnitOfWork(mock.Object, surveyRepository: GetSurveyRepository());


            }

            return _unitOfWork;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public static ISurveyRepository GetSurveyRepository()
        {
            var mock = new Mock<ISurveyRepository>();
            mock.Setup(p => p.Get(1)).Returns(new Survey() { Name = "Test Survey" });

            mock.Setup(s => s.GetSurveyWithUserPermissions(1, "test")).Returns(Task.FromResult(new Survey() { Name = "Test Survey" }));

            return mock.Object;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public static IAuthorizationService GetAuthorizationService()
        {
            var mock = new Mock<IAuthorizationService>();
            mock.Setup(p => p.AuthorizeAsync(It.IsAny<ClaimsPrincipal>(), It.IsAny<object>(), It.IsAny<IEnumerable<IAuthorizationRequirement>>())).Returns(Task.FromResult(AuthorizationResult.Success()));

            return mock.Object;

        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public static IAccountManager GetAccountManager()
        {
            var mock = new Mock<IAccountManager>();
            return mock.Object;
        }
    }
}