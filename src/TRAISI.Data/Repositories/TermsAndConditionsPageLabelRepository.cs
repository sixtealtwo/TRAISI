using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Traisi.Data.Models;
using Traisi.Data.Models.Surveys;
using Traisi.Data.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.IO;


namespace Traisi.Data.Repositories
{
    public class TermsAndConditionsPageLabelRepository : Repository<TermsAndConditionsPageLabel>, ITermsAndConditionsPageLabelRepository
    {
        public TermsAndConditionsPageLabelRepository(ApplicationDbContext context) : base(context) { }

        public TermsAndConditionsPageLabelRepository(DbContext context) : base(context) { }

        private ApplicationDbContext _appContext => (ApplicationDbContext)_context;

        public async Task<Label> GetTermsAndConditionsPageLabelAsync(int surveyId, string surveyViewName, string language = null)
        {
            if (language != null)
            {
                return await _appContext.SurveyViews.Where(s => s.Survey.Id == surveyId && s.ViewName == surveyViewName
                ).Include(s => s.TermsAndConditionsLabels)
                .Include(s => s.Survey)
                .Select(x => x.TermsAndConditionsLabels[language]).SingleOrDefaultAsync();
            }
            else
            {
				return await _appContext.SurveyViews.Where(s => s.Survey.Id == surveyId && s.ViewName == surveyViewName
				).Include(s => s.TermsAndConditionsLabels)
				.Include(s => s.Survey)
				.Select(x => x.TermsAndConditionsLabels[x.Survey.DefaultLanguage]).SingleOrDefaultAsync();
            }
        }

    }
}