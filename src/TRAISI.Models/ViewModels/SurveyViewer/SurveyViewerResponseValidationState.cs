using System.Collections.Concurrent;
using System.Collections.Generic;
using Traisi.Data.Models.ResponseTypes;
using Newtonsoft.Json.Linq;
using System;
using Traisi.Sdk.Library.ResponseTypes;

namespace Traisi.ViewModels.SurveyViewer
{
    public class SurveyViewerResponseValidationState
    {
        public ValidationState ValidationState { get; set; }
        public List<string> ErrorMessages { get; set; } = new List<string>();
    }

    public enum ValidationState {

        Invalid,
        Valid,
        Untouched
    }
}