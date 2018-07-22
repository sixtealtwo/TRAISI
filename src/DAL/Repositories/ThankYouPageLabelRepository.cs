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
    public class ThankYouPageLabelRepository : Repository<ThankYouPageLabel>, IThankYouPageLabelRepository
    {
        public ThankYouPageLabelRepository(ApplicationDbContext context) : base(context) { }

        public ThankYouPageLabelRepository(DbContext context) : base(context) { }

        private ApplicationDbContext _appContext => (ApplicationDbContext)_context;

        public async Task<ThankYouPageLabel> GetThankYouPageLabelAsync(int surveyId, string surveyViewName, string language = null)
        {
            if (language != null)
            {
                return await _appContext.ThankYouPageLabels
                            .Where(w => w.SurveyView.Survey.Id == surveyId && w.SurveyView.ViewName == surveyViewName && w.Language == language)
                            .SingleOrDefaultAsync();
            }
            else
            {
                return await _appContext.ThankYouPageLabels
                            .Where(w => w.SurveyView.Survey.Id == surveyId && w.SurveyView.ViewName == surveyViewName && w.Language == w.SurveyView.Survey.DefaultLanguage)
                            .SingleOrDefaultAsync();
            }
        }

    }


}