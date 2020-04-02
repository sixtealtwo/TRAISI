using System;
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
using TRAISI.ViewModels.SurveyBuilder;
using TRAISI.ViewModels.SurveyViewer;
using TRAISI.ViewModels.Users;
using TRAISI.ViewModels.Extensions;
using TRAISI.ViewModels.Questions;
using TRAISI.SDK;
using System.Collections.Concurrent;
using Newtonsoft.Json;
using TRAISI.Data.Models.ResponseTypes;
using Newtonsoft.Json.Linq;
using System.Reflection;
using System.Globalization;
using Newtonsoft.Json.Serialization;
using TRAISI.SDK.Enums;
using NetTopologySuite.Geometries;

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

            CreateMap<SurveyResponse, LocationResponseViewModel>().ForMember(
                m => m.ResponseValues, r => r.ResolveUsing<LocationValueResolver>()
            );
            
        
            /*CreateMap<LocationResponse, LocationResponseViewModel>().ForMember(
                m => m.Latitude, r => r.MapFrom(m => m.Location.Y)
            ).ForMember(
                m => m.Longitude, r => r.MapFrom(m => m.Location.X)
            ); */
            CreateMap<TimelineResponse, TimelineResponseViewModel>();

        }
    }

    public class LocationValueResolver : IValueResolver<SurveyResponse, LocationResponseViewModel, List<Dictionary<string, object>>>
    {
        public static CamelCasePropertyNamesContractResolver NamesContractResolver;
        static LocationValueResolver()
        {
            NamesContractResolver = new CamelCasePropertyNamesContractResolver();
        }
        public List<Dictionary<string, object>> Resolve(SurveyResponse source, LocationResponseViewModel destination, List<Dictionary<string, object>> destMember, ResolutionContext context)
        {
            List<Dictionary<string, object>> responseValues = new List<Dictionary<string, object>>();
            foreach (var response in source.ResponseValues)
            {
                Dictionary<string,object> values = new Dictionary<string, object>();
                var locationResponse = response as LocationResponse;
                values[NamesContractResolver.GetResolvedPropertyName("Address")] = locationResponse.Address;
                values[NamesContractResolver.GetResolvedPropertyName("Longitude")] = locationResponse.Location.X;
                values[NamesContractResolver.GetResolvedPropertyName("Latitude")] = locationResponse.Location.Y;
                responseValues.Add(values);
            }
            return responseValues;
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