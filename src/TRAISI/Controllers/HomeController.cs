// ====================================================
// More Templates: https://www.ebenmonney.com/templates
// Email: support@ebenmonney.com
// ====================================================

using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using DAL.Core;
using DAL.Core.Interfaces;
using DAL.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace TRAISI.Controllers
{
    public class HomeController : Controller
    {

        private IEntityManager<Survey> _entityManager;
        public HomeController(IEntityManager<Survey> entityManager)
        {
            this._entityManager = entityManager;
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
        [Route("api/[controller]"), Authorize, HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }
    }
}
