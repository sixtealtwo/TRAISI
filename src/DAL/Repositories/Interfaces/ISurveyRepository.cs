using System;
using System.Collections.Generic;
using System.Linq;
using DAL.Models;
using DAL.Models.Surveys;
using System.IO;

namespace DAL.Repositories.Interfaces {
	public interface ISurveyRepository : IRepository<Survey> { 

		
	 void LoadSurveyFromJson(Stream data);
	}

}