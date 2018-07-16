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

				public async Task<ThankYouPageLabel> GetThankYouPageLabelAsync(int surveyViewId, string language = null)
        {
					if (language != null) {
            return await _appContext.ThankYouPageLabel
									.Where(w => w.SurveyViewId == surveyViewId && w.Label.Language == language)
									.SingleOrDefaultAsync();
					}
					else {
						return await _appContext.ThankYouPageLabel
									.Where(w => w.SurveyViewId == surveyViewId && w.Label.Language == w.SurveyView.Survey.DefaultLanguage)
									.SingleOrDefaultAsync();
					}
        }

    }


}