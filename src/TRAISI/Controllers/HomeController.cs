// ====================================================
// More Templates: https://www.ebenmonney.com/templates
// Email: support@ebenmonney.com
// ====================================================

using System.Collections.Generic;
using System.Diagnostics;
using DAL.Core.Interfaces;
using DAL.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace TRAISI.Controllers
{
    public class HomeController : Controller
    {
        private IEntityManager<Survey> _entityManager;

        public HomeController(IEntityManager<Survey> entityManager)
        {
            _entityManager = entityManager;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Error()
        {
            ViewData["RequestId"] = Activity.Current?.Id ?? HttpContext.TraceIdentifier;
            return View();
        }


        // GET api/values
        [Route("api/[controller]")]
        [Authorize]
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new[] {"value1", "value2"};
        }
    }
}