using System.Collections.Generic;
using System.Linq;
using DAL;
using DAL.Models.Surveys;
using Microsoft.EntityFrameworkCore;
using TRAISI.Helpers;

namespace TRAISI.Export
{
    /// <summary>
    /// 
    /// </summary>
    internal class ResponderTableExporter
    {
        private readonly ApplicationDbContext _context;
        /// <summary>
        /// Initializer for helper object
        /// </summary>
        /// <param name="context"></param>
        /// <param name="questionTypeManager"></param>
        public ResponderTableExporter(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<SurveyRespondent> GetSurveyRespondents(Survey survey)
        {
            var primaryRespondents = _context.PrimaryRespondents
                .Where(sr => sr.Survey == survey)
                .OrderBy(sr => sr.Shortcode)
                .Include(sr => sr.SurveyRespondentGroup)
                .ThenInclude(srg => srg.GroupMembers)
                .ToList();

            var subRespondents = primaryRespondents.SelectMany(pr => pr.SurveyRespondentGroup.GroupMembers);

            return primaryRespondents.Cast<SurveyRespondent>().ToList();
        }
    }
}