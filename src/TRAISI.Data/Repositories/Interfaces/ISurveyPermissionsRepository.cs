using System;
using System.Collections.Generic;
using System.Linq;
using TRAISI.Data.Models;
using TRAISI.Data.Models.Surveys;
using System.IO;
using System.Threading.Tasks;

namespace TRAISI.Data.Repositories.Interfaces {
    public interface ISurveyPermissionsRepository : IRepository<SurveyPermission>
    {
        Task<SurveyPermission> GetPermissionsForSurveyAsync(string userName, int surveyID);

    }
}