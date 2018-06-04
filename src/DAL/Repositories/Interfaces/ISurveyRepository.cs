using System;
using System.Collections.Generic;
using System.Linq;
using DAL.Models;
using DAL.Models.Surveys;
using System.IO;
using System.Threading.Tasks;

namespace DAL.Repositories.Interfaces {
    public interface ISurveyRepository : IRepository<Survey>
    {
        void LoadSurveyFromJson(Stream data);
        Task<IEnumerable<Survey>> GetAllUserSurveys(string userName);

        Task<IEnumerable<Survey>> GetAllGroupSurveys(string groupName);

        Task<IEnumerable<Survey>> GetAllGroupSurveys(string groupName, string exceptUserName);

        Task<Survey> GetSurveyWithPermissions(int id);

    }
}