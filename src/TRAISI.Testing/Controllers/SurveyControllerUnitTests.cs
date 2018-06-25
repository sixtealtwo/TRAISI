using TRAISI.Controllers;
using Xunit;
using DAL.Repositories;
using DAL.Repositories.Interfaces;
using Moq;
using Microsoft.EntityFrameworkCore;
using DAL.Models.Surveys;
using TRAISI.Helpers;
using DAL;
using System;

namespace TRAISI.Testing.Controllers
{
    public class SurveyControllerUnitTests
    {

        private SurveyController _surveyController;


        public SurveyControllerUnitTests()
        {
            _surveyController = new SurveyController(TestingUtilities.GetUnitOfWork(),
            TestingUtilities.GetAuthorizationService(), TestingUtilities.GetAccountManager());
           
        }
        public async void TestGetSurvey()
        {
            var result = await _surveyController.GetSurvey(1);

            Console.WriteLine(result);
        }
    }
}