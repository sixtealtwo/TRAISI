using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DAL.Models.Surveys;
using DAL.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using DAL.Models.Questions;

namespace DAL.Repositories {
	class SurveyViewRepository : Repository<SurveyView>, ISurveyViewRepository {

		public SurveyViewRepository (DbContext context) : base (context) {

		}

		private ApplicationDbContext _appContext => (ApplicationDbContext) _context;

		/// <summary>
		/// Returns the list of survey views that belong to the specified survey with the passed id.
		/// </summary>
		/// <param name="surveyId">The survey id</param>
		/// <returns>(async) A list of all relevent SurveyView objects</returns>
		public Task<List<SurveyView>> GetSurveyViews (int surveyId) {
			return  _context.Set<SurveyView> ().Include (sv => sv.Survey)
				.Where (sv => sv.Survey.Id == surveyId).ToListAsync ();
		}

		/// <summary>
		/// Creates a new Survey View associated with the passed survey.
		/// </summary>
		/// <param name="survey"></param>
		/// <returns></returns>
		public Task<EntityEntry<SurveyView>> CreateSurveyView(Survey survey)
		{
			SurveyView view = new SurveyView(){
				Survey=survey
			};
			return  _context.AddAsync<SurveyView>(view);
		}

		/// <summary>
		/// 
		/// </summary>
		/// <param name="surveyId"></param>
		/// <param name="viewName"></param>
		/// <returns></returns>
		public async Task<SurveyView> GetSurveyViewWithPagesStructureAsync (int surveyId, string viewName) {
			var allviews = _appContext.SurveyViews.ToList();
			var surveyView = await _appContext.SurveyViews
					.Where(sv => sv.ViewName == viewName && sv.Survey.Id == surveyId)
					.Include(sv => sv.WelcomePageLabels)
					.Include(sv => sv.TermsAndConditionsLabels)
					.Include(sv => sv.ThankYouPageLabels)
					.Include(sv => sv.Survey).ThenInclude(s => s.TitleLabels)
					.Include(sv => sv.QuestionPartViews).ThenInclude(qpv => qpv.Labels)
					.SingleOrDefaultAsync();
			surveyView.QuestionPartViews = surveyView.QuestionPartViews.OrderBy(qp => qp.Order).ToList();
			return surveyView;
		}

        public SurveyView GetSurveyViewQuestionAndOptionStructure(int surveyId, string viewName)
        {
            return _appContext.SurveyViews
                .Where(s => s.Survey.Id == surveyId && s.ViewName == viewName)
                .Include(sv => sv.QuestionPartViews).ThenInclude(qpv => qpv.Labels)
                .Include(sv => sv.QuestionPartViews).ThenInclude(p => p.QuestionPartViewChildren).ThenInclude(qpv => qpv.Labels)
                .Include(sv => sv.QuestionPartViews).ThenInclude(p => p.QuestionPartViewChildren).ThenInclude(qp => qp.QuestionPart).ThenInclude(qp => qp.QuestionOptions).ThenInclude(o => o.QuestionOptionLabels)
                .Include(sv => sv.QuestionPartViews).ThenInclude(p => p.QuestionPartViewChildren).ThenInclude(qp => qp.QuestionPartViewChildren).ThenInclude(qpv => qpv.Labels)
                .Include(sv => sv.QuestionPartViews).ThenInclude(p => p.QuestionPartViewChildren).ThenInclude(qp => qp.QuestionPartViewChildren).ThenInclude(qpv => qpv.QuestionPart).ThenInclude(qp => qp.QuestionOptions).ThenInclude(o => o.QuestionOptionLabels)
                .SingleOrDefault();            
        }
    }
}