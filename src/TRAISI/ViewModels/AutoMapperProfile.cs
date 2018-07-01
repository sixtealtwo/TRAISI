// ====================================================
// More Templates: https://www.ebenmonney.com/templates
// Email: support@ebenmonney.com
// ====================================================

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DAL.Core;
using DAL.Models;
using DAL.Models.Groups;
using DAL.Models.Surveys;
using Microsoft.AspNetCore.Identity;

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

						CreateMap<SurveyPermission, SurveyPermissionViewModel>()
								.ReverseMap ();

						CreateMap<ApiKeys, ApiKeysViewModel>()
								.ForMember(a => a.GroupId, map => map.MapFrom(s => s.Group.Id))
								.ReverseMap();
						
						CreateMap<CodeGeneration, CodeGenerationViewModel>()
								.ReverseMap();
						
						CreateMap<GroupCodeViewModel, GroupCode>()
								.ForMember(gc => gc.Survey, map => map.Ignore());
						
						CreateMap<GroupCode, GroupCodeViewModel>()
								.ForMember(gc => gc.SurveyId, map => map.MapFrom(s => s.Survey.Id));

						CreateMap<ShortcodeViewModel, Shortcode>()
								.ForMember (sc => sc.GroupCode, map => map.Ignore())
								.ForMember (sc => sc.Survey, map => map.Ignore());
								//.ForMember (sc => sc.Respondent, map => map.Ignore());
						
						CreateMap<Shortcode, ShortcodeViewModel>()
								.ForMember(sc => sc.SurveyId, map => map.MapFrom(s => s.Survey.Id));
								//.ForMember(sc => sc.Respondent, map => map.MapFrom(r => r.Respondent.Id));
						
        }
    }
}