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

namespace TRAISI.ViewModels
{
    public partial class AutoMapperProfile : Profile
    {
        private void CreateSurveyViewerAutoMapperProfiles()
        {
            CreateMap<SurveyView, SurveyViewTermsAndConditionsViewModel>()
                .AfterMap((s, svm, opt) =>
                {
                    if (s.TermsAndConditionsLabels[opt.Items["Language"] as string] != null)
                    {
                        svm.TermsAndConditionsText =
                            s.TermsAndConditionsLabels[opt.Items["Language"] as string].Value;
                    }
                    else
                    {
                        svm.TermsAndConditionsText = s.TermsAndConditionsLabels.Default?.Value;
                    }

                });


            CreateMap<Survey, SurveyStartViewModel>()
                .AfterMap((s, svm, opt) =>
                {
                    var view = s.SurveyViews.FirstOrDefault();
                    if (view != null)
                    {
                        svm.WelcomeText = view.WelcomePageLabels[opt.Items["Language"] as string].Value;
                    }
                    else
                    {
                        svm.WelcomeText = view.WelcomePageLabels.Default?.Value;
                    }
                })
                .AfterMap((s, svm, opt) =>
                {
                    var view = s.SurveyViews.FirstOrDefault();
                    if (view != null)
                    {
                        svm.TitleText = view.Survey.TitleLabels[opt.Items["Language"] as string].Value;
                    }
                    else
                    {
                        svm.TitleText = view.Survey.TitleLabels.Default?.Value;
                    }
                });

            CreateMap<SurveyView, SurveyViewerViewModel>()
                .ForMember(vm => vm.Questions,
                map => map.MapFrom(v => v.QuestionPartViews))
                .AfterMap((s, svm, opt) =>
                {
                    svm.TitleText = s.Survey.TitleLabels[opt.Items["Language"] as string].Value;
                })
                .AfterMap((s, svm, opt) =>
                {
                    svm.SurveyCompletionText = s.ThankYouPageLabels[opt.Items["Language"] as string].Value;
                })
                .AfterMap((s, svm, opt) =>
                {
                    svm.TermsAndConditionsText = s.TermsAndConditionsLabels[opt.Items["Language"] as string].Value;
                })
                .AfterMap((s, svm, opt) =>
                {
                    svm.WelcomeText = s.WelcomePageLabels[opt.Items["Language"] as string].Value;
                });

            CreateMap<QuestionPartView, SurveyViewPageViewModel>()
                .ForMember(m => m.Sections,
                 map =>
                 {
                     map.MapFrom(v => v.QuestionPartViewChildren.Where(q => q.QuestionPart == null));
                 }
                 )
                 .ForMember(m => m.Questions, map => map.MapFrom(v => v.QuestionPartViewChildren.Where(q => q.QuestionPart != null)))
                .AfterMap((s, svm, opt) => { svm.Label = s.Labels[opt.Items["Language"] as string].Value; });


            CreateMap<QuestionPartView, SurveyViewSectionViewModel>()
                .ForMember(m => m.Questions, map => map.MapFrom(v => v.QuestionPartViewChildren))
                .AfterMap((s, svm, opt) => { svm.Label = s.Labels[opt.Items["Language"] as string].Value; });

            CreateMap<QuestionConditional, SurveyViewConditionalViewModel>()
                .ForMember(m => m.ConditionalType, map => map.MapFrom(v => v.Condition));

            CreateMap<QuestionPartView, QuestionViewModel>()
                .ForMember(m => m.QuestionType, map => map.MapFrom(v => v.QuestionPart.QuestionType))
                .ForMember(m => m.IsOptional, map => map.MapFrom(v => v.isOptional))
                .ForMember(m => m.Order, map => map.MapFrom(v => v.Order))
                .ForMember(m => m.Label, map => map.Ignore())
                .ForMember(m => m.IsHousehold, map => map.MapFrom(f => f.isHousehold))
                 .ForMember(m => m.SourceConditionals, map =>
                 {
                     map.MapFrom(f => f.QuestionPart.QuestionConditionalsSource);
                     map.Condition(f => f.QuestionPart != null);
                 })
                .ForMember(m => m.TargetConditionals, map =>
                 {
                     map.MapFrom(f => f.QuestionPart.QuestionConditionalsTarget);
                     map.Condition(f => f.QuestionPart != null);
                 })
                .AfterMap((s, svm, opt) =>
                {
                    try { svm.Label = s.Labels[opt.Items["Language"] as string].Value; }
                    catch (Exception e)
                    {
                        Console.WriteLine(e);

                    }

                })
                .AfterMap((s, svm, opt) =>
                {
                    if (s.QuestionPart != null)
                    {
                        svm.QuestionId = s.QuestionPart.Id;
                    }

                })
                .AfterMap((s, svm, opt) =>
                {
                    if (s.QuestionPart != null && s.QuestionPart.QuestionConfigurations.Count > 0)
                    {
                        svm.Configuration = new ConcurrentDictionary<string, object>();
                        s.QuestionPart.QuestionConfigurations.AsParallel().ForAll(a =>
                        {

                            svm.Configuration[a.Name] = a.Value;
                        });


                    }

                });


            CreateMap<QuestionOption, QuestionOptionViewModel>()
            .ForMember(o => o.Id, map => map.MapFrom(v => v.Id))
                .ForMember(o => o.Name, map => map.MapFrom(v => v.Name))
                .ForMember(o => o.Order, map => map.MapFrom(v => v.Order))
                .ForMember(o => o.Label, map => map.Ignore())

                .AfterMap((s, svm, opt) =>
                {
                    try { svm.Label = s.QuestionOptionLabels[opt.Items["Language"] as string].Value; }
                    catch (Exception e)
                    {
                        Console.WriteLine(e);

                    }

                });


        }
    }
}