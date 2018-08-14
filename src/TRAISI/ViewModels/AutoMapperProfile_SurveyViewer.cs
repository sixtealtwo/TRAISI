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

namespace TRAISI.ViewModels
{
    public partial class AutoMapperProfile : Profile
    {
        private void CreateSurveyViewerAutoMapperProfiles()
        {
            CreateMap<SurveyView, SurveyViewTermsAndConditionsViewModel>()
                .AfterMap((s, svm, opt) =>
                {
                    if (s.TermsAndConditionsLabels[opt.Items["Language"] as string] != null) {
                        svm.TermsAndConditionsText =
                            s.TermsAndConditionsLabels[opt.Items["Language"] as string].Value;
                    }
                    else {
                        svm.TermsAndConditionsText = s.TermsAndConditionsLabels.Default?.Value;
                    }

                });


            CreateMap<Survey, SurveyStartViewModel>()
                .AfterMap((s, svm, opt) =>
                {
                    var view = s.SurveyViews.FirstOrDefault();
                    if (view != null) {
                        svm.WelcomeText = view.WelcomePageLabels[opt.Items["Language"] as string].Value;
                    }
                    else {
                        svm.WelcomeText = view.WelcomePageLabels.Default?.Value;
                    }
                })
                .AfterMap((s, svm, opt) =>
                {
                    var view = s.SurveyViews.FirstOrDefault();
                    if (view != null) {
                        svm.TitleText = view.Survey.TitleLabels[opt.Items["Language"] as string].Value;
                    }
                    else {
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
        }
    }
}