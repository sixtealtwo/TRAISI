using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DAL.Models;
using DAL.Models.Surveys;

namespace DAL.Repositories.Interfaces
{
	public interface IWelcomePageLabelRepository : IRepository<WelcomePageLabel>
	{
		Task<WelcomePageLabel> GetWelcomePageLabelAsync(int surveyId, string surveyViewName, string language = null);
    }
}