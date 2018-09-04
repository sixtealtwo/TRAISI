using System.Collections.Generic;
using System.Threading.Tasks;
using DAL.Models.Questions;

namespace DAL.Repositories.Interfaces
{
    public interface IQuestionConditionalRepository  : IRepository<QuestionConditional> {
        void DeleteSourceConditionals(int questionPartId, List<int> retainedConditionals);
        void DeleteTargetConditionals(int questionPartId, List<int> retainedConditionals);
        Task<IEnumerable<QuestionConditional>> GetQuestionConditionalsAsync(int questionPartId);
    }
}