using System.Threading.Tasks;
using DAL.Models;
using DAL.Models.Questions;
using DAL.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Linq;
namespace DAL.Repositories
{
    /// <summary>
    /// 
    /// </summary>
    public class QuestionOptionRepository : Repository<QuestionOption>, IQuestionOptionRepository
    {
  
        public QuestionOptionRepository(ApplicationDbContext context) : base(context)
        {

        }

        
    }
}