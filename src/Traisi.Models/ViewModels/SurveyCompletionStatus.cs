
using System.Collections.Generic;

namespace Traisi.Models.ViewModels 
{

    public class SurveyCompletionStatus
    {
        public Dictionary<int, RespondentCompletionStatus> Statuses { get; set; } = new Dictionary<int, RespondentCompletionStatus>();
    }

    public class RespondentCompletionStatus
    {
        public Dictionary<int, bool> HasResponse { get; set; } = new Dictionary<int, bool>();
    }
}