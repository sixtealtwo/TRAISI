using TRAISI.Data.Models.Surveys;
using TRAISI.Data.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace TRAISI.Data.Repositories
{
    public class SurveyRespondentGroupRepository : Repository<SurveyRespondentGroup>, ISurveyRespondentGroupRepository
    {
        public SurveyRespondentGroupRepository(DbContext context) : base(context)
        {
        }
    }
}