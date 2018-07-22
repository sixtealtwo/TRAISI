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

namespace TRAISI.ViewModels {
    public class AutoMapperProfile : Profile {
        public AutoMapperProfile () {
            CreateMap<ApplicationUser, UserViewModel> ()
                .ForMember (d => d.Roles, map => map.Ignore ());

            CreateMap<UserViewModel, ApplicationUser> ()
                .ForMember (d => d.Roles, map => map.Ignore ());

            CreateMap<ApplicationUser, UserEditViewModel> ()
                .ForMember (d => d.Roles, map => map.Ignore ());

            CreateMap<UserEditViewModel, ApplicationUser> ()
                .ForMember (d => d.Roles, map => map.Ignore ());

            CreateMap<ApplicationUser, UserPatchViewModel> ()
                .ReverseMap ();

            CreateMap<ApplicationRole, RoleViewModel> ()
                .ForMember (d => d.Permissions, map => map.MapFrom (s => s.Claims))
                .ForMember (d => d.UsersCount, map => map.ResolveUsing (s => s.Users?.Count ?? 0))
                .ReverseMap ();
            CreateMap<RoleViewModel, ApplicationRole> ();

            CreateMap<IdentityRoleClaim<string>, ClaimViewModel> ()
                .ForMember (d => d.Type, map => map.MapFrom (s => s.ClaimType))
                .ForMember (d => d.Value, map => map.MapFrom (s => s.ClaimValue))
                .ReverseMap ();

            CreateMap<ApplicationPermission, PermissionViewModel> ()
                .ReverseMap ();

            CreateMap<IdentityRoleClaim<string>, PermissionViewModel> ()
                .ConvertUsing (s => Mapper.Map<PermissionViewModel> (ApplicationPermissions.GetPermissionByValue (s.ClaimValue)));

            CreateMap<Survey, SurveyViewModel> ()
                .ReverseMap ();

            CreateMap<GroupMember, GroupMemberViewModel> ();

            CreateMap<GroupMemberViewModel, GroupMember> ()
                .ForMember (d => d.User, map => map.Ignore ())
                .ForMember (d => d.UserGroup, map => map.Ignore ());

            CreateMap<UserGroup, UserGroupViewModel> ()
                .ReverseMap ();

            CreateMap<SurveyPermission, SurveyPermissionViewModel> ()
                .ReverseMap ();

            CreateMap<ApiKeys, ApiKeysViewModel> ()
                .ForMember (a => a.GroupId, map => map.MapFrom (s => s.Group.Id))
                .ReverseMap ();

            CreateMap<EmailTemplate, EmailTemplateViewModel> ()
                .ForMember (a => a.GroupName, map => map.MapFrom (s => s.Group.Name))
                .ReverseMap ();

            CreateMap<CodeGeneration, CodeGenerationViewModel> ()
                .ReverseMap ();

            CreateMap<GroupCodeViewModel, GroupCode> ()
                .ForMember (gc => gc.Survey, map => map.Ignore ());

            CreateMap<GroupCode, GroupCodeViewModel> ()
                .ForMember (gc => gc.SurveyId, map => map.MapFrom (s => s.Survey.Id));

            CreateMap<ShortcodeViewModel, Shortcode> ()
                .ForMember (sc => sc.GroupCode, map => map.Ignore ())
                .ForMember (sc => sc.Survey, map => map.Ignore ());
            //.ForMember (sc => sc.Respondent, map => map.Ignore());

            CreateMap<Shortcode, ShortcodeViewModel> ()
                .ForMember (sc => sc.SurveyId, map => map.MapFrom (s => s.Survey.Id));
            //.ForMember(sc => sc.Respondent, map => map.MapFrom(r => r.Respondent.Id));

            CreateMap<QuestionPartView, QuestionPartViewViewModel> ()
                .AfterMap ((s, svm, opt) => { svm.Label = s.Labels.FirstOrDefault (l => l.Language == (string) opt.Items["Language"]).Value; });

            CreateMap<QuestionPartView, SBQuestionPartViewViewModel>()
                .AfterMap((s, svm, opt) => { svm.Label = s.Labels.FirstOrDefault(l => l.Language == (string)opt.Items["Language"]).Value; });

            CreateMap<SBQuestionPartViewViewModel, QuestionPartView>()
                .ForMember(s => s.Labels, map => map.Ignore())
                .ForMember(s => s.QuestionPart, map => map.Ignore())
                .ForMember(s => s.SurveyView, map => map.Ignore());

            CreateMap<SBSurveyViewViewModel, SurveyView> ()
                .ForMember (m => m.TermsAndConditionsLabel, map => map.Ignore ())
                .ForMember (m => m.ThankYouPageLabel, map => map.Ignore ())
                .ForMember (m => m.WelcomePageLabel, map => map.Ignore ());

            CreateMap<SurveyView, SBSurveyViewViewModel> ()
                .ForMember (vm => vm.SurveyId, map => map.MapFrom (m => m.Survey.Id))
                .ForMember (vm => vm.Pages, map => map.MapFrom (m => m.QuestionPartViews))
                .AfterMap((s, svm, opt) => { svm.SurveyCompletionPage = Mapper.Map<ThankYouPageLabelViewModel>(s.ThankYouPageLabel.FirstOrDefault(l => l.Language == (string)opt.Items["Language"])); })
                .AfterMap((s, svm, opt) => { svm.TermsAndConditionsPage = Mapper.Map<TermsAndConditionsPageLabelViewModel>(s.TermsAndConditionsLabel.FirstOrDefault(l => l.Language == (string)opt.Items["Language"])); })
                .AfterMap((s, svm, opt) => { svm.WelcomePage = Mapper.Map<WelcomePageLabelViewModel>(s.WelcomePageLabel.FirstOrDefault(l => l.Language == (string)opt.Items["Language"])); });

            CreateMap<SurveyView, SurveyViewerViewModel> ()
                .ForMember (vm => vm.Questions, map => map.MapFrom (v => v.QuestionPartViews))
                .AfterMap ((s, svm, opt) => { svm.TitleText = s.Survey.TitleLabel.FirstOrDefault (l => l.Language == (string) opt.Items["Language"]).Value; })
                .AfterMap ((s, svm, opt) => { svm.SurveyCompletionText = s.ThankYouPageLabel.FirstOrDefault (l => l.Language == (string) opt.Items["Language"]).Value; })
                .AfterMap ((s, svm, opt) => { svm.TermsAndConditionsText = s.TermsAndConditionsLabel.FirstOrDefault (l => l.Language == (string) opt.Items["Language"]).Value; })
                .AfterMap ((s, svm, opt) => { svm.WelcomeText = s.WelcomePageLabel.FirstOrDefault (l => l.Language == (string) opt.Items["Language"]).Value; });

            CreateMap<WelcomePageLabelViewModel, WelcomePageLabel> ()
                .ForMember (w => w.SurveyView, map => map.Ignore ())
                .ReverseMap ();

            CreateMap<ThankYouPageLabelViewModel, ThankYouPageLabel> ()
                .ForMember (w => w.SurveyView, map => map.Ignore ())
                .ReverseMap ();

            CreateMap<TermsAndConditionsPageLabelViewModel, TermsAndConditionsPageLabel> ()
                .ForMember (w => w.SurveyView, map => map.Ignore ())
                .ReverseMap ();

            CreateMap<LabelViewModel, Label> ()
                .ReverseMap ();

            CreateMap<SiteSurveyTemplate, SiteSurveyTemplateViewModel> ()
                .ReverseMap ();

        }

    }
}