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
using TRAISI.SDK.Enums;

namespace TRAISI.ViewModels
{
    public partial class AutoMapperProfile : Profile
    {
        private void CreateSurveyResponderAutoMapperProfiles()
        {
            CreateMap<SurveyResponse, SurveyResponseViewModel>()
               .ForMember(s => s.ResponseValues, r => r.ResolveUsing<ResponseValueResolver>())
                .AfterMap((s, svm, opt) =>
                {
                    if (s.QuestionPart != null && s.QuestionPart.QuestionConfigurations.Count > 0)
                    {
                        svm.Configuration = new ConcurrentDictionary<string, object>();
                        s.QuestionPart.QuestionConfigurations.AsParallel().ForAll(a =>
                        {
                            switch (a.ValueType)
                            {
                                case ConfigurationValueType.Integer:
                                    svm.Configuration[ResponseValueResolver.NamesContractResolver.GetResolvedPropertyName(a.Name).Replace(" ", "")] =
                                    int.Parse(a.Value);
                                    break;
                                case ConfigurationValueType.Decimal:
                                    svm.Configuration[ResponseValueResolver.NamesContractResolver.GetResolvedPropertyName(a.Name).Replace(" ", "")] =
                                    double.Parse(a.Value);
                                    break;
                                default:
                                    svm.Configuration[ResponseValueResolver.NamesContractResolver.GetResolvedPropertyName(a.Name).Replace(" ", "")] = a.Value;
                                    break;
                            }

                        });


                    }

                });


            CreateMap<SurveyRespondentGroup, SurveyRespondentGroupViewModel>();

            CreateMap<SurveyRespondent, SurveyRespondentViewModel>();

            CreateMap<SubRespondent, SurveyRespondentViewModel>();
            CreateMap<SurveyRespondentViewModel, SubRespondent>()
                .ForMember(m => m.SurveyRespondentGroup, c => c.Ignore());

            CreateMap<PrimaryRespondent, SurveyRespondentViewModel>();

        }
    }

    /// <summary>
    /// Converts the response value generic to a dictionary of key - values
    /// </summary>
    /// <typeparam name="string"></typeparam>
    /// <typeparam name="object"></typeparam>
    public class ResponseValueResolver : IValueResolver<SurveyResponse, SurveyResponseViewModel, List<Dictionary<string, object>>>
    {
        public static CamelCasePropertyNamesContractResolver NamesContractResolver;
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
        public List<Dictionary<string, object>> Resolve(SurveyResponse source,
        SurveyResponseViewModel destination, List<Dictionary<string, object>> destMember, ResolutionContext context)
        {

            List<Dictionary<string, object>> responseValues = new List<Dictionary<string, object>>();
            foreach (var response in source.ResponseValues)
            {
                var obj = response.GetType()
                            .GetProperties(BindingFlags.Instance | BindingFlags.Public).Where(f =>
                            {
                                return f.PropertyType != typeof(SurveyResponse) && f.Name != "Id";
                            })
                          .ToDictionary(prop => NamesContractResolver.GetResolvedPropertyName(prop.Name), prop => prop.GetValue(response, null));

                responseValues.Add(obj);
            }

            return responseValues;
        }
    }
}