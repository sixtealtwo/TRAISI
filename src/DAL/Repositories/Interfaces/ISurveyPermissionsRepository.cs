using System;
using System.Collections.Generic;
using System.Linq;
using DAL.Models;
using DAL.Models.Surveys;
using System.IO;
using System.Threading.Tasks;

namespace DAL.Repositories.Interfaces {
    public interface ISurveyPermissionsRepository : IRepository<SurveyPermission>
    {
        Task<string[]> GetPermissionsForSurvey(string userName, int surveyID);

    }
}