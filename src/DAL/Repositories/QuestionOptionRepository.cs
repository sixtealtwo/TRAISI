using DAL.Models;
using DAL.Models.Questions;
using DAL.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories
{
    /// <summary>
    /// 
    /// </summary>
    public class QuestionOptionRepository : Repository<QuestionOption>, IQuestionOptionRepository
    {
        public QuestionOptionRepository(DbContext context) : base(context)
        {
            //context.ChangeTracker.
        }
    }
}