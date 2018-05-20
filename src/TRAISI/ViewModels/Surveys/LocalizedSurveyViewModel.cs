
using System;
using System.Collections.Generic;
using DAL.Models;
using DAL.Models.Surveys;

namespace TRAISI.ViewModels.Surveys
{
	/// <summary>
	/// Localized version of ISurvey. 
	/// </summary>
	public class LocalizedSurveyViewModel : ISurvey
	{
		public int Id { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }
		public string Owner { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }
		public string Group { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }
		public DateTime StartAt { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }
		public DateTime EndAt { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }
		public bool IsActive { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }
		public bool IsOpen { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }
		public string SuccessLink { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }
		public string RejectionLink { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }
		public string DefaultLanguage { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }
		public string StyleTemplate { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }
		public ICollection<Label> NameLabel { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }
		public string Name { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }
		public ICollection<Label> TitleLabel { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }
	}
}