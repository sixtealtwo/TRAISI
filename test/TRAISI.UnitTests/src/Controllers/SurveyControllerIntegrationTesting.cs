using System;
using System.Net.Http;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.TestHost;
using Xunit;
using Xunit.Abstractions;
using TRAISI.Controllers;

namespace TRAISI.Testing.Controllers
{
    public class SurveyControllerIntegrationTesting
    {
        private readonly TestServer _server;
        private readonly HttpClient _client;

        private readonly ITestOutputHelper _output;

        public SurveyControllerIntegrationTesting(ITestOutputHelper output)
        {
            _server = new TestServer(new TRAISITestWebHostBuilder()
                             .UseStartup<TestStartup>());

            _client = _server.CreateClient();
            output.WriteLine("In creating client");
            _output = output;

        }

        public void BlankTest()
        {

            Assert.True(false);


        }
    }
}