using System;
using System.Collections.Generic;
using System.Linq;
using DAL.Models;
using DAL.Models.Surveys;
using System.IO;
using System.Threading.Tasks;

namespace DAL.Repositories.Interfaces
{
    public interface ISurveyRepository : IRepository<Survey>
    {
        void LoadSurveyFromJson(Stream data);
        
        Task<IEnumerable<Survey>> GetAllUserSurveysAsync(string userName);

        Task<IEnumerable<Survey>> GetAllGroupSurveysAsync(string groupName);

        Task<IEnumerable<Survey>> GetAllGroupSurveysAsync(string groupName, string exceptUserName);

        Task<Survey> GetSurveyWithPermissionsAsync(int id);

        Task<Survey> GetSurveyWithUserPermissionsAsync(int id, string userName);

        Task<IEnumerable<Survey>> GetSharedSurveysAsync(string userName);

        Task<Survey> GetSurveyByNameFullAsync(string name);

        Task<Survey> GetSurveyFullAsync(int surveyId);

        Task<Survey> GetSurveyForShortcode(string shortcode);

        bool QuestionNameIsUnique(int surveyId, string name, string oldName);

    }
}