using DAL.Models.Surveys;
using DAL.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories
{
    public class SurveyRespondentGroupRepository : Repository<SurveyRespondentGroup>, ISurveyRespondentGroupRepository
    {
        public SurveyRespondentGroupRepository(DbContext context) : base(context)
        {
        }
    }
}