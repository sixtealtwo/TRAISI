using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL.Models;
using DAL.Models.Surveys;
using DAL.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.IO;


namespace DAL.Repositories
{
    public class SurveyRepository : Repository<Survey>, ISurveyRepository
    {
        public SurveyRepository(ApplicationDbContext context) : base(context) { }

        public SurveyRepository(DbContext context) : base(context) { }

        private ApplicationDbContext _appContext => (ApplicationDbContext)_context;

        /// <summary>
        /// Loads a survey and all associated objects from a given inputstream with JSON data
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public async void LoadSurveyFromJson(Stream data)
        {
            await this.AddAsync(new Survey());
        }
    }
}