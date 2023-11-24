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
    [SurveyQuestion(QuestionResponseType.Json, CodeBundleName = "traisi-questions-video.module.js")]
    public class VideoModule : ISurveyQuestion
    {
        public string TypeName => "video";

        public string Icon
        {
            get => "fas fa-play";
        }
        public QuestionIconType IconType { get => QuestionIconType.FONT; }

        [QuestionOption(QuestionOptionValueType.KeyValuePair,
        IsMultipleAllowed = true,
            Name = "Video Link",
            Description = "The link to the YouTube video to be displayed.",
            SurveyBuilderValueType = QuestionOptionValueType.KeyValuePair)]
        public ICollection VideoLink;
    }

}
