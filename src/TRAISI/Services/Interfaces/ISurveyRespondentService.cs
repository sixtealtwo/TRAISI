using System.Collections.Generic;
using System.Threading.Tasks;
using TRAISI.Data.Models.Questions;
using TRAISI.Data.Models.Surveys;
using TRAISI.Data.Core;
using TRAISI.SDK;
using Microsoft.AspNetCore.Http;
using TRAISI.Data.Models;

namespace TRAISI.Services.Interfaces
{
    public interface ISurveyRespondentService 
    {
        public Task<PrimaryRespondent> CreatePrimaryRespondentForUser(ApplicationUser user, Survey survey);
    }
}
