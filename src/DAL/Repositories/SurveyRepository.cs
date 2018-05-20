// ====================================================
// More Templates: https://www.ebenmonney.com/templates
// Email: support@ebenmonney.com
// ====================================================

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using DAL.Models;
using DAL.Repositories.Interfaces;
using DAL.Models.Surveys;

namespace DAL.Repositories
{
    public class SurveyRepository : Repository<Survey>, ISurveyRepository
    {
        public SurveyRepository(ApplicationDbContext context) : base(context)
        { }


        private ApplicationDbContext _appContext => (ApplicationDbContext)_context;
    }
}
