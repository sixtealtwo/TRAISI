using System;
using System.Collections.Generic;
using System.Linq;
using DAL.Models;
using DAL.Models.Surveys;
using System.IO;
using System.Threading.Tasks;
using DAL.Core;

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

        Task<Survey> GetSurveyByCodeAsync(string code);

        Task<Survey> GetSurveyByCodeFullAsync(string code);

        Task<Survey> GetSurveyLabelsAndPartsAsync(int surveyId);

        Task<Survey> GetSurveyFullAsync(int surveyId, SurveyViewType viewType);

        Task<Survey> GetSurveyFullExportAsync(int surveyId);

        Task<Survey> GetSurveyForShortcode(string shortcode);


        bool QuestionNameIsUnique(int surveyId, string name, string oldName);

    }
}