using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using DAL.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace TRAISI.Controllers
{
    [Authorize]
    [Route("api/survey-management")]
    public class SurveyManagementController
    {
        /// <summary>
        /// Returns a list of all surveys.
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [Route("api/survey-management/surveys"), Authorize, HttpGet]
        public IEnumerable<Survey> Get()
        {
            return new Survey[]{} ;
        }
    }
}