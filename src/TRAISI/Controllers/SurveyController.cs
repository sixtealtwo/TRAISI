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

        /// <summary>
        /// Get survey by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSurvey(int id)
        {
            var survey=  await this._entityManager.GetEntityAsync(id);

            return new ObjectResult(survey);
        }
        
        /// <summary>
        /// Get all surveys
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetSurveys()
        {
            var surveys=  await this._entityManager.GetEntitiesAsync();

            return new ObjectResult(surveys);
        }

        /// <summary>
        /// Create survey
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> CreateSurvey([FromBody] SurveyViewModel survey)
        {
            if (ModelState.IsValid)
            {
                if (survey == null)
                    return BadRequest($"{nameof(survey)} cannot be null");

                Survey appSurvey = Mapper.Map<Survey>(survey);

                var newsurvey = await this._entityManager.CreateEntityAsync(appSurvey);

                return new ObjectResult(newsurvey);
            } 

            return BadRequest(ModelState);
        }

        /// <summary>
        /// Update a survey
        /// </summary>
        [HttpPut]
        public async Task<IActionResult> UpdateSurvey([FromBody] SurveyViewModel survey)
        {
            Survey appSurvey = Mapper.Map<Survey>(survey);

            var updatedsurvey=  await this._entityManager.UpdateEntityAsync(appSurvey);

            return new ObjectResult(updatedsurvey);
        }

        
        /// <summary>
        /// Delete a survey
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSurvey(int id)
        {
            var survey=  await this._entityManager.DeleteEntityAsync(id);

            return null;
        }

        

    }
}
