using System.Collections.Generic;
using System.Linq;
using Traisi.Data.Core;

namespace Traisi.Data.Models.Extensions {
	public class SurveyViewCollection<T>  : List<T> {



		

		/// <summary>
		/// 
		/// </summary>
		/// <param name="typeKey"></param>
		public T this[SurveyViewType typeKey]
		{
			get
			{
				if (typeKey == SurveyViewType.RespondentView) {
					return base[0];
				}
				else {
					return base[1];
				}
			}

		}
		
	}
}