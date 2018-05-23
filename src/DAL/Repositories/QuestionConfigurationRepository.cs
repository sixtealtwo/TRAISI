using DAL.Models.Surveys;
using DAL.Repositories.Interfaces;

namespace DAL.Repositories {
    public class QuestionConfigurationRepository : Repository<QuestionConfiguration>, IQuestionConfigurationRepository {

        /// <summary>
        /// 
        /// </summary>
        /// <param name="context"></param>
        public QuestionConfigurationRepository (ApplicationDbContext context) : base (context) { }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        private ApplicationDbContext _appContext => (ApplicationDbContext) _context;

    }
}