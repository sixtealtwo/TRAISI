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
using TRAISI.SDK.Library.ResponseTypes;

namespace TRAISI.ViewModels
{
    public partial class AutoMapperProfile : Profile
    {
        private void CreateSurveyResponderAutoMapperProfiles()
        {
            CreateMap<SurveyResponse, SurveyResponseViewModel>()
               .ForMember(s => s.ResponseValues, r => r.ResolveUsing<ResponseValueResolver>())
               .ForMember(s => s.Configuration, r => r.ResolveUsing<SurveyResponseConfigurationValueResolver>());

            CreateMap<SurveyRespondentGroup, SurveyRespondentGroupViewModel>();
            CreateMap<SurveyRespondent, SurveyRespondentViewModel>();
            CreateMap<SubRespondent, SurveyRespondentViewModel>();
            CreateMap<SurveyRespondentViewModel, SubRespondent>()
                .ForMember(m => m.SurveyRespondentGroup, c => c.Ignore());
            CreateMap<PrimaryRespondent, SurveyRespondentViewModel>();
            CreateMap<SurveyResponse, LocationResponseViewModel>().ForMember(
                m => m.ResponseValues, r => r.ResolveUsing<LocationResponseValueResolver>()
            ).ForMember(s => s.Configuration, r => r.ResolveUsing<SurveyResponseConfigurationValueResolver>());

            CreateMap<SurveyResponse, TimelineResponseViewModel>().ForMember(
                m => m.ResponseValues, r => r.ResolveUsing<TimelineResponseValueResolver>()
            ).ForMember(s => s.Configuration, r => r.ResolveUsing<SurveyResponseConfigurationValueResolver>());
        }
    }

    public class TimelineResponseValueResolver : IValueResolver<SurveyResponse, TimelineResponseViewModel, List<TimelineResponseValueViewModel>>
    {
        public List<TimelineResponseValueViewModel> Resolve(SurveyResponse source, TimelineResponseViewModel destination, List<TimelineResponseValueViewModel> destMember, ResolutionContext context)
        {
            List<TimelineResponseValueViewModel> responseValues = new List<TimelineResponseValueViewModel>();
            foreach (var response in source.ResponseValues)
            {
                var locationResponse = response as TimelineResponse;

                responseValues.Add(new TimelineResponseValueViewModel()
                {
                    Address = locationResponse.Address,
                    Latitude = locationResponse.Location != null ? locationResponse.Location.Y : 0,
                    Longitude = locationResponse.Location != null ? locationResponse.Location.X : 0,
                    Name = locationResponse.Name,
                    Order = locationResponse.Order.GetValueOrDefault(),
                    Purpose = locationResponse.Purpose

                });
            }
            return responseValues;
        }
    }

    public class SurveyResponseConfigurationValueResolver : IValueResolver<SurveyResponse, SurveyResponseViewModel, ConcurrentDictionary<string, object>>
    {
        public ConcurrentDictionary<string, object> Resolve(SurveyResponse source, SurveyResponseViewModel destination, ConcurrentDictionary<string, object> destMember, ResolutionContext context)
        {
            var configuration = new ConcurrentDictionary<string, object>();
            if (source.QuestionPart?.QuestionConfigurations?.Count > 0)
            {
                source.QuestionPart.QuestionConfigurations.AsParallel().ForAll(a =>
                {
                    switch (a.ValueType)
                    {
                        case ConfigurationValueType.Integer:
                            configuration[ResponseValueResolver.NamesContractResolver.GetResolvedPropertyName(a.Name).Replace(" ", "")] =
                            int.Parse(a.Value);
                            break;
                        case ConfigurationValueType.Decimal:
                            configuration[ResponseValueResolver.NamesContractResolver.GetResolvedPropertyName(a.Name).Replace(" ", "")] =
                            double.Parse(a.Value);
                            break;
                        case ConfigurationValueType.Custom:
                            configuration[ResponseValueResolver.NamesContractResolver.GetResolvedPropertyName(a.Name).Replace(" ", "")] = a.Value;
                            break;
                        default:
                            configuration[ResponseValueResolver.NamesContractResolver.GetResolvedPropertyName(a.Name).Replace(" ", "")] = a.Value;
                            break;
                    }

                });


            }
            return configuration;
        }
    }

    public class LocationResponseValueResolver : IValueResolver<SurveyResponse, LocationResponseViewModel, List<LocationResponseValueViewModel>>
    {
        public List<LocationResponseValueViewModel> Resolve(SurveyResponse source, LocationResponseViewModel destination, List<LocationResponseValueViewModel> destMember, ResolutionContext context)
        {
            List<LocationResponseValueViewModel> responseValues = new List<LocationResponseValueViewModel>();
            foreach (var response in source.ResponseValues)
            {
                var locationResponse = response as LocationResponse;

                responseValues.Add(new LocationResponseValueViewModel()
                {
                    Address = locationResponse.Address,
                    Latitude = locationResponse.Location.Y,
                    Longitude = locationResponse.Location.X

                });
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