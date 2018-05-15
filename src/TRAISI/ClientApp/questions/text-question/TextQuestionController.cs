using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace TRAISI.ClientApp.questions
{

  [Route("api/[controller]")]
  public class TextQuestionController : Controller
  {
    // GET
    [HttpGet]
    public IActionResult Index()
    {
      return new OkResult();
    }
  }
}
