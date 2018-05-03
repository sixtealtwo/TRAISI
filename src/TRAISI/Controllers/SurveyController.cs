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
    [Route("[controller]")]
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
        [HttpGet("survey/{id}")]
        public async Task<IActionResult> GetSurvey(int id)
        {
            var survey=  await this._entityManager.GetEntityAsync(id);

            return new ObjectResult(survey);


        }

        [HttpGet("{name}")]
        public string GetName(string name)
        {
            return "value: " + name;
        }

        [HttpGet("{owner}")]
        public string GetOwner(string owner)
        {
            return "value: " + owner;
        }

        [HttpGet("{group}")]
        public string GetGroup(string group)
        {
            return "value: " + group;
        }

        [HttpGet("{startat}")]
        public string GetStartAtDateTime(DateTime startat)
        {
            return "value: " + startat;
        }

        [HttpGet("{endat}")]
        public string GetEndAtDateTime(DateTime endat)
        {
            return "value: " + endat;
        }

        [HttpGet("{isactive}")]
        public string GetIsActiveStatus(Boolean isactive)
        {
            return "value: " + isactive;
        }





        // POST api/values
        [HttpPost("{id}")]
        public void CreateId(int id, [FromBody]string value)
        {
        }

        [HttpPost("{name}")]
        public void CreateName(string name, [FromBody]string value)
        {
        }

        [HttpPost("{owner}")]
        public void RegisterOwner(string owner, [FromBody]string value)
        {
        }

        [HttpPost("{group}")]
        public void RegisterGroup(string group, [FromBody]string value)
        {
        }

        [HttpPost("{startat}")]
        public void CreateStartAtDateTime(DateTime startat, [FromBody]string value)
        {
        }

        [HttpPost("{endat}")]
        public void CreateEndAtDateTime(DateTime endat, [FromBody]string value)
        {
        }

        [HttpPost("{isactive}")]
        public void CreateIsActiveStatus(Boolean isactive, [FromBody]string value)
        {
        }




        // PUT api/values
        
        // [HttpPut("{id}")]
        // public void UpdateID(int id, [FromBody]string value)
        // {
        // }

        [HttpPut("{name}")]
        public void UpdateName(string name, [FromBody]string value)
        {
        }

        [HttpPut("{owner}")]
        public void UpdateOwner(string owner, [FromBody]string value)
        {
        }

        // [HttpPut("{group}")]
        // public void UpdateGroup(string group, [FromBody]string value)
        // {
        // }

        [HttpPut("{startat}")]
        public void UpdateStartAtDateTime(DateTime startat, [FromBody]string value)
        {
        }

        [HttpPut("{endat}")]
        public void UpdateEndAtDateTime(DateTime endat, [FromBody]string value)
        {
        }

        [HttpPut("{isactive}")]
        public void UpdateIsActiveStatus(Boolean isactive, [FromBody]string value)
        {
        }


        // DELETE api/values
        [HttpDelete("{id}")]
        public void DeleteId(int id)
        {
        }

        [HttpDelete("{name}")]
        public void DeleteName(string name)
        {
        }

        [HttpDelete("{owner}")]
        public void DeleteOwner(string owner)
        {
        }

        [HttpDelete("{group}")]
        public void DeleteGroup(string group)
        {
        }

        [HttpDelete("{startat}")]
        public void DeleteStartAtDateTime(DateTime startat)
        {
        }

        [HttpDelete("{endat}")]
        public void DeleteEndAtDateTime(DateTime endat)
        {
        }

        [HttpDelete("{isactive}")]
        public void DeleteIsActiveStatus(Boolean isactive)
        {
        }
    }
}
