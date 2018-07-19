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
    public class TermsAndConditionsPageLabelRepository : Repository<TermsAndConditionsPageLabel>, ITermsAndConditionsPageLabelRepository
    {
        public TermsAndConditionsPageLabelRepository(ApplicationDbContext context) : base(context) { }

        public TermsAndConditionsPageLabelRepository(DbContext context) : base(context) { }

        private ApplicationDbContext _appContext => (ApplicationDbContext)_context;

				public async Task<TermsAndConditionsPageLabel> GetTermsAndConditionsPageLabelAsync(string surveyViewName, string language = null)
        {
					if (language != null) {
            return await _appContext.TermsAndConditionsPageLabels
									.Where(w => w.SurveyView.ViewName == surveyViewName && w.Label.Language == language)
									.Include(w => w.Label)
									.SingleOrDefaultAsync();
					}
					else {
						return await _appContext.TermsAndConditionsPageLabels
									.Where(w => w.SurveyView.ViewName == surveyViewName && w.Label.Language == w.SurveyView.Survey.DefaultLanguage)
									.Include(w => w.Label)
									.SingleOrDefaultAsync();
					}
        }

    }
}