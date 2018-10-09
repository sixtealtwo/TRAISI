using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DAL.Core;
using DAL.Models;
using DAL.Models.Groups;
using DAL.Models.Questions;
using DAL.Models.Surveys;
using Microsoft.AspNetCore.Identity;
using TRAISI.ViewModels.SurveyBuilder;
using TRAISI.ViewModels.SurveyViewer;
using TRAISI.ViewModels.Users;
using TRAISI.ViewModels.Extensions;
using TRAISI.ViewModels.Questions;
using TRAISI.SDK;
using System.Collections.Concurrent;
using Newtonsoft.Json;
using DAL.Models.ResponseTypes;
using Newtonsoft.Json.Linq;
using System.Reflection;
using System.Globalization;
using Newtonsoft.Json.Serialization;

namespace TRAISI.ViewModels
{
    public partial class AutoMapperProfile : Profile
    {
        private void CreateSurveyResponderAutoMapperProfiles()
        {
            CreateMap<SurveyResponse, SurveyResponseViewModel>()
               .ForMember(s => s.ResponseValue, r => r.ResolveUsing<ResponseValueResolver>());


            CreateMap<SurveyRespondentGroup, SurveyRespondentGroupViewModel>();

            CreateMap<SurveyRespondent, SurveyRespondentViewModel>();

        }
    }

    /// <summary>
    /// Converts the response value generic to a dictionary of key - values
    /// </summary>
    /// <typeparam name="string"></typeparam>
    /// <typeparam name="object"></typeparam>
    public class ResponseValueResolver : IValueResolver<SurveyResponse, SurveyResponseViewModel, Dictionary<string, object>>
    {
        static CamelCasePropertyNamesContractResolver NamesContractResolver;
        static ResponseValueResolver()
        {
            NamesContractResolver = new CamelCasePropertyNamesContractResolver();
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="source"></param>
        /// <param name="destination"></param>
        /// <param name="destMember"></param>
        /// <param name="context"></param>
        /// <returns></returns>
        public Dictionary<string, object> Resolve(SurveyResponse source,
        SurveyResponseViewModel destination, Dictionary<string, object> destMember, ResolutionContext context)
        {

            var obj = source.ResponseValue.GetType()
            .GetProperties(BindingFlags.Instance | BindingFlags.Public).Where(f =>
            {
                return f.PropertyType != typeof(SurveyResponse) && f.Name != "Id";
            })
          .ToDictionary(prop => NamesContractResolver.GetResolvedPropertyName(prop.Name), prop => prop.GetValue(source.ResponseValue, null));
            return obj;
        }
    }
}