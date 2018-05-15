using DAL;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace TRAISI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class SurveyBuilderController
    {
        private IUnitOfWork _unitOfWork;
        
        /// <summary>
        /// 
        /// </summary>
        /// <param name="httpUnitOfWork"></param>
        public SurveyBuilderController(HttpUnitOfWork httpUnitOfWork)
        {
            this._unitOfWork = httpUnitOfWork;
        }
    }
}