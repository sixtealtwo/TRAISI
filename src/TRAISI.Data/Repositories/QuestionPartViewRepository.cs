using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DAL.Models.Surveys;
using DAL.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using DAL.Models.Questions;

namespace DAL.Repositories
{
    /// <summary>
    /// 
    /// </summary>
    public class QuestionPartViewRepository : Repository<QuestionPartView>, IQuestionPartViewRepository
    {
        public QuestionPartViewRepository(ApplicationDbContext context) : base(context) { }
        private ApplicationDbContext _appContext => (ApplicationDbContext)_context;

        public async Task<QuestionPartView> GetQuestionPartViewWithStructureAsync(int? questionPartViewId)
        {
            var questionPartView = await _appContext.QuestionPartViews
                    .Where(qp => qp.Id == questionPartViewId)
                    .Include(qp => qp.QuestionPart)
                    .Include(qp => qp.Labels)
                    .Include(qp => qp.RepeatSource)
                    .Include(qp => qp.Conditionals).ThenInclude(d => d.Lhs)
                    .Include(qp => qp.Conditionals).ThenInclude(d => d.Rhs)
                    .Include(qpv => qpv.CATIDependent).ThenInclude(d => d.Labels)
                    .Include(qp => qp.QuestionPartViewChildren).ThenInclude(qpv => qpv.Labels)
                    .Include(qp => qp.QuestionPartViewChildren).ThenInclude(qpv => qpv.QuestionPart)
                    .Include(qp => qp.QuestionPartViewChildren).ThenInclude(qp => qp.RepeatSource)
                    .Include(sv => sv.QuestionPartViewChildren).ThenInclude(qpv => qpv.CATIDependent).ThenInclude(d => d.Labels)
                    .Include(qp => qp.QuestionPartViewChildren).ThenInclude(qp => qp.QuestionPartViewChildren).ThenInclude(qpv => qpv.Labels)
                    .Include(qp => qp.QuestionPartViewChildren).ThenInclude(qp => qp.QuestionPartViewChildren).ThenInclude(qpv => qpv.QuestionPart)
                    .Include(qp => qp.QuestionPartViewChildren).ThenInclude(qp => qp.QuestionPartViewChildren).ThenInclude(qp => qp.RepeatSource)
                    .Include(qp => qp.QuestionPartViewChildren).ThenInclude(sv => sv.QuestionPartViewChildren).ThenInclude(qpv => qpv.CATIDependent).ThenInclude(d => d.Labels)
                    .SingleOrDefaultAsync();
            if (questionPartView != null)
            {
                questionPartView.QuestionPartViewChildren = questionPartView.QuestionPartViewChildren.OrderBy(qp => qp.Order).ToList();
            }
            return questionPartView;
        }

        public QuestionPartView GetQuestionPartViewWithStructure(int questionPartViewId)
        {
            var questionPartView = _appContext.QuestionPartViews
                    .Where(qp => qp.Id == questionPartViewId)
                    .Include(qp => qp.QuestionPart)
                    .Include(qp => qp.Labels)
                    .Include(qp => qp.RepeatSource)
                    .Include(qpv => qpv.CATIDependent).ThenInclude(d => d.Labels)
                    .Include(qp => qp.QuestionPartViewChildren).ThenInclude(qpv => qpv.Labels)
                    .Include(qp => qp.QuestionPartViewChildren).ThenInclude(qpv => qpv.QuestionPart)
                    .Include(qp => qp.QuestionPartViewChildren).ThenInclude(qp => qp.RepeatSource)
                    .Include(sv => sv.QuestionPartViewChildren).ThenInclude(qpv => qpv.CATIDependent).ThenInclude(d => d.Labels)
                    .Include(qp => qp.QuestionPartViewChildren).ThenInclude(qp => qp.QuestionPartViewChildren).ThenInclude(qpv => qpv.Labels)
                    .Include(qp => qp.QuestionPartViewChildren).ThenInclude(qp => qp.QuestionPartViewChildren).ThenInclude(qpv => qpv.QuestionPart)
                    .Include(qp => qp.QuestionPartViewChildren).ThenInclude(qp => qp.QuestionPartViewChildren).ThenInclude(qp => qp.RepeatSource)
                    .Include(qp => qp.QuestionPartViewChildren).ThenInclude(sv => sv.QuestionPartViewChildren).ThenInclude(qpv => qpv.CATIDependent).ThenInclude(d => d.Labels)
                    .SingleOrDefault();
            if (questionPartView != null)
            {
                questionPartView.QuestionPartViewChildren = questionPartView.QuestionPartViewChildren.OrderBy(qp => qp.Order).ToList();
            }
            return questionPartView;
        }

        public List<QuestionPartView> GetQuestionPartViewsWithParent(int questionPartViewParentId)
        {
            return _appContext.QuestionPartViews
                .Where(qp => qp.ParentView.Id == questionPartViewParentId)
                .ToList();
        }
    }
}