using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using TRAISI.Data.Core;
using TRAISI.Data.Models;
using TRAISI.Data.Models.Groups;
using TRAISI.Data.Models.Questions;
using TRAISI.Data.Models.Surveys;
using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using TRAISI.SDK;
using TRAISI.SDK.Enums;
using TRAISI.ViewModels.Extensions;
using TRAISI.ViewModels.Questions;
using TRAISI.ViewModels.SurveyBuilder;
using TRAISI.ViewModels.SurveyViewer;
using TRAISI.ViewModels.Users;

namespace TRAISI.ViewModels
{
    /// <summary>
    /// AutoMapper profile for survey builder models
    /// </summary>
    public partial class AutoMapperProfile : Profile
    {

        private void CreateSurveyBuilderAutoMapperProfiles()
        {
            CreateMap<SurveyLogicViewModel, SurveyLogic>()
                .ForMember(s => s.QuestionId, opts => opts.MapFrom(o => int.Parse(o.Field)))
                .ForMember(s => s.Question, opts => opts.Ignore())
                .ForMember(s => s.ValidationMessages, opts => opts.MapFrom(o => o.Message));

            CreateMap<string, SurveyLogicLabel>().ConvertUsing<StringToLabelConverter<SurveyLogicLabel>>();

             CreateMap<SurveyLogic, SurveyLogicViewModel>()
                .ForMember(s => s.Field, opts => opts.MapFrom(o => (o.QuestionId)))
                .ForMember(s => s.Operator, opts => opts.MapFrom(o => o.Operator))
                .ForMember(s => s.Message, opts => opts.Ignore())
                .ForMember(s => s.Rules, opts => opts.UseValue(new List<SurveyLogicViewModel>()))
                .ForMember(s => s.Value, opts => opts.MapFrom(o => o.Value));
        }


    }

    /// <summary>
    /// 
    /// </summary>
    public class StringToLabelConverter<TLabel> : ITypeConverter<string, TLabel> where TLabel : Label, new()
    {
        public TLabel Convert(string source, TLabel destination, ResolutionContext context)
        {
            return new TLabel()
            {
                Language = "en",
                Value = source
            };
        }
    }
}