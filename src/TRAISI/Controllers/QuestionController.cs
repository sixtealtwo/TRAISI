using Microsoft.AspNetCore.Mvc;

namespace TRAISI.Controllers
{
    public class QuestionController : Controller
    {
        // GET
        public IActionResult Index()
        {
            return
            View();
        }
    }
}