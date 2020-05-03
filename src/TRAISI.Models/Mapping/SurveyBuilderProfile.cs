using System.Collections.Generic;
using AutoMapper;
using Traisi.Models.ViewModels;
using Traisi.Data.Models.Surveys;
using Traisi.Data.Models.Extensions;

namespace Traisi.Models.Mapping
{
    public class SurveyBuilderProfile : Profile
    {
        public SurveyBuilderProfile()
        {

            CreateMap<SurveyLogicViewModel, SurveyLogic>()
            .ForMember(s => s.QuestionId, opts => opts.MapFrom(o => int.Parse(o.Field)))
            .ForMember(s => s.Question, opts => opts.Ignore())
            .ForMember(s => s.ValidationMessages, opts => opts.MapFrom<LabelValueResolver, string>(x => x.Message))

            .ForMember(s => s.Id, opts => opts.MapFrom(o => o.Id));

            CreateMap<SurveyLogic, SurveyLogicViewModel>()
            .ForMember(s => s.Field, opts => opts.MapFrom(o => (o.QuestionId)))
            .ForMember(s => s.Operator, opts => opts.MapFrom(o => o.Operator))
            .ForMember(s => s.Message, opts => opts.Ignore())
            .ForMember(s => s.Value, opts => opts.MapFrom(o => o.Value));
        }


    }
}