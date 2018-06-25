using System.Net.Http;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.TestHost;
namespace TRAISI.Testing.Controllers
{
    public class SurveyControllerIntegrationTesting
    {
        private readonly TestServer _server;
        private readonly HttpClient _client;
        public SurveyControllerIntegrationTesting()
        {
            _server = new TestServer(new WebHostBuilder()
                             .UseStartup<Startup>());

        
            _client = _server.CreateClient();


        }
    }
}