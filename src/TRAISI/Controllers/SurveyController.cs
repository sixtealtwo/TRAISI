// ====================================================
// More Templates: https://www.ebenmonney.com/templates
// Email: support@ebenmonney.com
// ====================================================

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DAL;
using TRAISI.ViewModels;
using AutoMapper;
using DAL.Core.Interfaces;
using DAL.Models;
using Microsoft.Extensions.Logging;
using TRAISI.Helpers;
using Microsoft.Extensions.Options;

namespace TRAISI.Controllers
{
    [Route("api/[controller]")]
    public class SurveyController : Controller
    {

        private IEntityManager<Survey> _entityManager;


        /// <summary>
        /// 
        /// </summary>
        /// <param name="_entityManager"></param>
        public SurveyController(IEntityManager<Survey> _entityManager)
        {
            this._entityManager = _entityManager;

        }

        // GET api/values
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSurvey(int id)
        {
            var survey=  await this._entityManager.GetEntityAsync(id);

            return new ObjectResult(survey);
        }
        
        [HttpGet]
        public async Task<IActionResult> GetSurveys()
        {
            var surveys=  await this._entityManager.GetEntitiesAsync();

            return new ObjectResult(surveys);
        }
        

    }
}
