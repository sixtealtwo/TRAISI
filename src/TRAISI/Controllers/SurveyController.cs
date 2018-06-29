using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using DAL;
using DAL.Core.Interfaces;
using DAL.Models.Surveys;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using TRAISI.Helpers;
using TRAISI.ViewModels;


namespace TRAISI.Controllers
{
	[Authorize]
	[Route("api/[controller]")]
	public class SurveyController : Controller
	{

		private IUnitOfWork _unitOfWork;

		private readonly IAuthorizationService _authorizationService;
		private readonly IAccountManager _accountManager;

		public SurveyController(IUnitOfWork unitOfWork, IAuthorizationService authorizationService, IAccountManager accountManager)
		{
			this._unitOfWork = unitOfWork;
			this._authorizationService = authorizationService;
			this._accountManager = accountManager;
		}

		/// <summary>
		/// Get survey by ID
		/// </summary>
		[HttpGet("{id}")]
		[Produces(typeof(SurveyViewModel))]
		public async Task<IActionResult> GetSurvey(int id)
		{
			var survey = await this._unitOfWork.Surveys.GetSurveyWithPermissions(id);
			if (survey.Owner == this.User.Identity.Name || await isSuperAdmin() || await isGroupAdmin(survey.Group))
			{
				return Ok(Mapper.Map<SurveyViewModel>(survey));
			}
			else
			{
				var surveyPermissions = await this._unitOfWork.Surveys.GetSurveyWithUserPermissions(id, this.User.Identity.Name);
				if (surveyPermissions.SurveyPermissions.Any())
				{
					return Ok(Mapper.Map<SurveyViewModel>(surveyPermissions));
				}
				else
				{
					return BadRequest("User does not have permissions to access survey.");
				}
			}

		}

		/// <summary>
		/// Get all surveys owned by the calling user
		/// </summary>
		[HttpGet]
		[Produces(typeof(List<SurveyViewModel>))]
		public async Task<IActionResult> GetSurveys()
		{
			var surveys = await this._unitOfWork.Surveys.GetAllUserSurveys(this.User.Identity.Name);
			return Ok(Mapper.Map<IEnumerable<SurveyViewModel>>(surveys));
		}

		/// <summary>
		/// Get all surveys for the specified group where user is not owner and has no permissions.
		/// </summary>
		[HttpGet("group/{id}")]
		[Produces(typeof(List<SurveyViewModel>))]
		public async Task<IActionResult> GetGroupSurveysWithNoPermissions(int id)
		{
			var group = this._unitOfWork.UserGroups.Get(id);
			if (group == null)
			{
				return BadRequest("Group does not exist.");
			}
			else
			{
				//Check if user is in the group or superadmin
				if (await isSuperAdmin() || await memberOfGroup(id))
				{
					var surveys = await this._unitOfWork.Surveys.GetAllGroupSurveys(group.Name, this.User.Identity.Name);
					return Ok(Mapper.Map<IEnumerable<SurveyViewModel>>(surveys));
				}
				else
				{
					return BadRequest("User does not have access to group.");
				}
			}
		}

		/// <summary>
		/// Get all surveys shared with user
		/// </summary>
		/// <returns></returns>
		[HttpGet("shared")]
		[Produces(typeof(List<SurveyViewModel>))]
		public async Task<IActionResult> GetSharedSurveys()
		{
			var surveys = await this._unitOfWork.Surveys.GetSharedSurveys(this.User.Identity.Name);
			return Ok(Mapper.Map<IEnumerable<SurveyViewModel>>(surveys));
		}


		/// <summary>
		/// Create survey
		/// </summary>
		[HttpPost]
		public async Task<IActionResult> CreateSurvey([FromBody] SurveyViewModel survey)
		{

			if (ModelState.IsValid)
			{
				if (survey == null)
				{
					return BadRequest($"{nameof(survey)} cannot be null");
				}
				else
				{
					// Check if survey has a valid group
					Survey appSurvey = Mapper.Map<Survey>(survey);
					var group = await this._unitOfWork.UserGroups.GetGroupByName(appSurvey.Group);

					if (group == null)
					{
						return BadRequest("Group does not exist.");
					}
					else
					{
						if(await isSuperAdmin() || await this.memberOfGroup(group.Id))
						{
							appSurvey.Owner = this.User.Identity.Name;
							await this._unitOfWork.Surveys.AddAsync(appSurvey);
							await this._unitOfWork.SaveChangesAsync();
							return new OkResult();
						}
						else
						{
							return BadRequest("User must be a member of the group to create the survey.");
						}
						
					}
				}
			}

			return BadRequest(ModelState);
		}

		/// <summary>
		/// Update a survey
		/// </summary>
		[HttpPut]
		public async Task<IActionResult> UpdateSurvey([FromBody] SurveyViewModel survey)
		{
			//check group of input survey and ensure that user has access before updating survey
			
			Survey appSurvey = Mapper.Map<Survey>(survey);
			Survey originalSurvey = this._unitOfWork.Surveys.Get(appSurvey.Id);
			if (await isSuperAdmin() || originalSurvey.Owner == this.User.Identity.Name || await isGroupAdmin(appSurvey.Group))
			{
				originalSurvey.Code = appSurvey.Code;
				originalSurvey.DefaultLanguage = appSurvey.DefaultLanguage;
				originalSurvey.EndAt = appSurvey.EndAt;
				originalSurvey.IsActive = appSurvey.IsActive;
				originalSurvey.IsOpen = appSurvey.IsOpen;
				originalSurvey.Name = appSurvey.Name;
				originalSurvey.RejectionLink = appSurvey.RejectionLink;
				originalSurvey.StartAt = appSurvey.StartAt;
				originalSurvey.StyleTemplate = appSurvey.StyleTemplate;
				originalSurvey.SuccessLink = appSurvey.SuccessLink;

				await this._unitOfWork.SaveChangesAsync();
				return new OkResult();
			}
			else
			{
				var surveyPermissions = await this._unitOfWork.SurveyPermissions.GetPermissionsForSurvey(this.User.Identity.Name, appSurvey.Id);
				if (surveyPermissions.Permissions.Contains("survey.modify"))
				{
					
					appSurvey.Owner = originalSurvey.Owner;
					appSurvey.Group = originalSurvey.Group;
					appSurvey.Code = originalSurvey.Code;
					appSurvey.SurveyPermissions = originalSurvey.SurveyPermissions;
					appSurvey.SurveyViews = originalSurvey.SurveyViews;
					this._unitOfWork.Surveys.Update(appSurvey);
					await this._unitOfWork.SaveChangesAsync();
					return new OkResult();
				}
				else
				{
					return BadRequest("Insufficient privileges.");
				}	
			}
		}

		/// <summary>
		/// Delete a survey
		/// </summary>
		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteSurvey(int id)
		{
			// restrict to owner, group admin, and users with delete permissions
			var survey = await this._unitOfWork.Surveys.GetSurveyWithPermissions(id);
			var removed = this._unitOfWork.Surveys.Get(id);
			if (survey.Owner == this.User.Identity.Name || await isGroupAdmin(survey.Group))
			{
				this._unitOfWork.Surveys.Remove(removed);
				await this._unitOfWork.SaveChangesAsync();
				return new OkResult();
			}
			else
			{
				var surveyPermissions = await this._unitOfWork.SurveyPermissions.GetPermissionsForSurvey(this.User.Identity.Name, survey.Id);
				if (surveyPermissions.Permissions != null && surveyPermissions.Permissions.Contains("survey.delete"))
				{
					this._unitOfWork.Surveys.Remove(removed);
					await this._unitOfWork.SaveChangesAsync();
					return new OkResult();
				}
				else
				{
					return BadRequest("Insufficient privileges.");
				}

			}
		}
	
		/// <summary>
		/// Get user permissions for given survey
		/// </summary>
		/// <param name="id"></param>
		/// <param name="userName"></param>
		/// <returns></returns>
		[HttpGet("{id}/permissions/{userName}")]
		[Produces(typeof(List<SurveyPermissionViewModel>))]
		public async Task<IActionResult> GetUserSurveyPermissions(int id, string userName)
		{	
			var survey = await this._unitOfWork.Surveys.GetAsync(id);
			var surveyPermissions = await this._unitOfWork.SurveyPermissions.GetPermissionsForSurvey(userName, id);
			//Restrict to super admins, group admins, owners, and users with survey.share permissions
			if (survey.Owner == this.User.Identity.Name || await isSuperAdmin() || await isGroupAdmin(survey.Group))
			{
				return Ok(Mapper.Map<SurveyPermissionViewModel>(surveyPermissions));
			}
			else
			{
				if (surveyPermissions.Permissions.Contains("survey.share"))
				{
					return Ok(Mapper.Map<SurveyPermissionViewModel>(surveyPermissions));
				}
				else
				{
					return BadRequest("Insufficient privileges.");
				}
			}
		}
	

		/// <summary>
		/// Update user permissions for given survey
		/// </summary>
		/// <param name="userName"></param>
		/// <returns></returns>
		[HttpPut("permissions")]
		public async Task<IActionResult> UpdateUserSurveyPermissions([FromBody] SurveyPermissionViewModel surveyPermissions)
		{
			var survey = await this._unitOfWork.Surveys.GetAsync(surveyPermissions.SurveyId);
			var surveyPermissionsModel = Mapper.Map<SurveyPermission>(surveyPermissions);
			// Restrict to group admins, owners, and users with survey.share permissions.
			if (survey.Owner == this.User.Identity.Name || await isGroupAdmin(survey.Group))
			{
				this._unitOfWork.SurveyPermissions.Update(surveyPermissionsModel);
				await this._unitOfWork.SaveChangesAsync();
				return new OkResult();
			}
			else
			{
				var userPermissions = await this._unitOfWork.SurveyPermissions.GetPermissionsForSurvey(this.User.Identity.Name, surveyPermissions.SurveyId);
				if(surveyPermissions.Permissions.Contains("survey.share"))
				{
					this._unitOfWork.SurveyPermissions.Update(surveyPermissionsModel);
					await this._unitOfWork.SaveChangesAsync();
					return new OkResult();
				}
				else
				{
					return BadRequest("Insufficient privileges.");
				}
			}
		}


		/// <summary>
		/// Check if group admin has given permission
		/// </summary>
		/// <param name="permission"></param>
		/// <returns></returns>
		private async Task<bool> CheckGroupAdminPermission(string permission)
		{
			var role = await _accountManager.GetRoleLoadRelatedAsync("group administrator");
			var hasPermission = (from r in role.Claims
													 where r.ClaimValue == permission
													 select r).Any();
			return hasPermission;
		}

		/// <summary>
		/// Check if user is super admin
		/// </summary>
		/// <param name="User"></param>
		/// <returns></returns>
		private async Task<bool> isSuperAdmin()
		{
			var isSuperAdmin = (await _authorizationService.AuthorizeAsync(this.User, Authorization.Policies.ManageAllGroupsPolicy)).Succeeded;
			return isSuperAdmin;
		}

		/// <summary>
		/// Check if user is group admin and has permissions to manage group surveys
		/// </summary>
		/// <param name="id"></param>
		/// <param name="user"></param>
		/// <returns></returns>
		private async Task<bool> isGroupAdmin(string groupName)
		{
			bool groupAdminHasPermission = await this.CheckGroupAdminPermission("surveys.managegroup");
			var isGroupAdmin = groupAdminHasPermission && await this._unitOfWork.GroupMembers.IsGroupAdmin(this.User.Identity.Name, groupName);
			return isGroupAdmin;
		}

		/// <summary>
		/// Check if user is a member of given group
		/// </summary>
		/// <param name="groupId"></param>
		/// <returns></returns>
		private async Task<bool> memberOfGroup(int groupId)
		{
			var groupMembers = await this._unitOfWork.UserGroups.GetGroupMembersInfoAsync(groupId);
			bool memberOfGroup = groupMembers.Where(m => m.Item1.UserName == this.User.Identity.Name).Any();
			return memberOfGroup;
		}
	}
}