using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using Traisi.Sdk.Attributes;
using Traisi.Sdk.Enums;
using Traisi.Sdk.Interfaces;
using Traisi.Sdk.Library.ResponseTypes;

namespace Traisi.Sdk.Questions
{
    [SurveyQuestion(QuestionResponseType.Json, CodeBundleName = "traisi-questions-link-button.module.js")]
    public class LinkButton : ISurveyQuestion
    {
        public string TypeName => "link-button";

        public string Icon
        {
            get => "fas fa-link";
        }
        public QuestionIconType IconType { get => QuestionIconType.FONT; }

        [QuestionOption(QuestionOptionValueType.KeyValuePair,
        IsMultipleAllowed = true,
            Name = "Button Link",
            Description = "The link that the button will open when clicked.",
            SurveyBuilderValueType = QuestionOptionValueType.KeyValuePair)]
        public ICollection ButtonLink;

        [QuestionOption(QuestionOptionValueType.KeyValuePair,
        IsMultipleAllowed = true,
            Name = "Button Text",
            Description = "The text that the button will display.",
            SurveyBuilderValueType = QuestionOptionValueType.KeyValuePair)]
        public ICollection ButtonText;
    }

}
