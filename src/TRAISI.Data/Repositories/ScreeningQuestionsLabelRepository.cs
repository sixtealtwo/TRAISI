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
    public class ScreeningQuestionsLabelRepository : Repository<ScreeningQuestionsPageLabel>, IScreeningQuestionsLabelRepository
    {
        public ScreeningQuestionsLabelRepository(ApplicationDbContext context) : base(context) { }

        public ScreeningQuestionsLabelRepository(DbContext context) : base(context) { }

        private ApplicationDbContext _appContext => (ApplicationDbContext)_context;

        public async Task<ScreeningQuestionsPageLabel> GetScreeningQuestionsLabelAsync(int surveyId, string surveyViewName, string language = null)
        {
            if (language != null)
            {
                return await _appContext.ScreeningQuestionsLabels
                                        .Where(w => w.SurveyView.Survey.Id == surveyId && w.SurveyView.ViewName == surveyViewName && w.Language == language)
                                        .SingleOrDefaultAsync();
            }
            else
            {
                return await _appContext.ScreeningQuestionsLabels
                            .Where(w => w.SurveyView.Survey.Id == surveyId && w.SurveyView.ViewName == surveyViewName && w.Language == w.SurveyView.Survey.DefaultLanguage)
                            .SingleOrDefaultAsync();
            }
        }

    }

}