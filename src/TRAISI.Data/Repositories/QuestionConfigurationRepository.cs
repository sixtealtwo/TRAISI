using TRAISI.Data.Models.Questions;
using TRAISI.Data.Models.Surveys;
using TRAISI.Data.Repositories.Interfaces;

namespace TRAISI.Data.Repositories {
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