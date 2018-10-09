using System.Threading.Tasks;
using DAL.Models;
using DAL.Models.Surveys;
using DAL.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
namespace DAL.Repositories
{
    public class SurveyRespondentRepository : Repository<SurveyRespondent>, ISurveyRespondentRepository
    {
        public SurveyRespondentRepository(DbContext context) : base(context)
        {

        }

        private ApplicationDbContext _appContext => (ApplicationDbContext)_context;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public async Task<PrimaryRespondent> GetPrimaryRespondentForUserAsync(ApplicationUser user)
        {
            var respondent =  await this._appContext.PrimaryRespondents.Where(r => r.User == user)
            .Include(s => s.SurveyRespondentGroup)
            .ThenInclude(s => s.GroupMembers)
            .Include(s => s.Shortcode)
            .FirstOrDefaultAsync();

            if(respondent == null)
            {
                return await this.CreatePrimaryResponentForUserAsnyc(user);
            }
            else
            {
                return respondent;
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="respondentId"></param>
        /// <returns></returns>
        public async Task<SubRespondent> GetSubRespondentAsync(int respondentId)
        {
            return await this._appContext.SubRespondents.Where(r => r.Id == respondentId)
            .Include(s => s.SurveyRespondentGroup)
            .ThenInclude(s => s.GroupMembers)
            .FirstOrDefaultAsync();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public async Task<PrimaryRespondent> CreatePrimaryResponentForUserAsnyc(ApplicationUser user)
        {
            PrimaryRespondent respondent = new PrimaryRespondent()
            {
                User = user,
                SurveyRespondentGroup = new SurveyRespondentGroup()
            };

            await this._entities.AddAsync(respondent);

            return respondent;
        }
    }
}