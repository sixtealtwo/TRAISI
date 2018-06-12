using DAL.Models;
using DAL.Models.Questions;
using DAL.Repositories.Interfaces;

namespace DAL.Repositories
{
	/// <summary>
	/// 
	/// </summary>
	public class QuestionPartRepository : Repository<QuestionPart>, IQuestionPartRepository
	{
		/// <summary>
		/// 
		/// </summary>
		/// <param name="context"></param>
		public QuestionPartRepository(ApplicationDbContext context) : base(context)
		{
		}

		/// <summary>
		/// 
		/// </summary>
		/// <returns></returns>
		private ApplicationDbContext _appContext => (ApplicationDbContext)_context;
	}
}