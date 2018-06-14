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
			if( await isOwner(id) || await isSuperAdmin() || await isGroupAdmin(survey.Group))
			{
				
				return Ok(Mapper.Map<SurveyViewModel>(survey));
			}
			else
			{
				var surveyPermissions = await this._unitOfWork.Surveys.GetSurveyWithUserPermissions(id,this.User.Identity.Name);
				if (surveyPermissions.SurveyPermissions.Any())
				{
					return Ok(Mapper.Map<SurveyViewModel>(surveyPermissions));
				}
				else
				{
					return BadRequest("User does not have permissions to access this survey.");
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
		/// Get all surveys owned for the specified group
		/// </summary>
		[HttpGet("group/{id}")]
		[Produces(typeof(List<SurveyViewModel>))]
		public async Task<IActionResult> GetGroupSurveys(int id)
		{
			var group = this._unitOfWork.UserGroups.Get(id);
			var surveys = await this._unitOfWork.Surveys.GetAllGroupSurveys(group.Name, this.User.Identity.Name);
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

				Survey appSurvey = Mapper.Map<Survey>(survey);
				appSurvey.Owner = this.User.Identity.Name;
				await this._unitOfWork.Surveys.AddAsync(appSurvey);
				await this._unitOfWork.SaveChangesAsync();
				return new OkResult();
			}

			return BadRequest(ModelState);
		}

		/// <summary>
		/// Update a survey
		/// </summary>
		[HttpPut]
		public async Task<IActionResult> UpdateSurvey([FromBody] SurveyViewModel survey)
		{

			// to do: check group of input survey and ensure that user has access before updating survey

			Survey appSurvey = Mapper.Map<Survey>(survey);

			this._unitOfWork.Surveys.Update(appSurvey);
			await this._unitOfWork.SaveChangesAsync();
			return new OkResult();
		}

		/// <summary>
		/// Delete a survey
		/// </summary>
		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteSurvey(int id)
		{
			var removed = this._unitOfWork.Surveys.Get(id);
			this._unitOfWork.Surveys.Remove(removed);
			await this._unitOfWork.SaveChangesAsync();
			return new OkResult();
		}

		private bool GroupValidForUser(string groupName)
		{
			return true;
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
		/// Check if user is owner of given survey
		/// </summary>
		/// <param name="surveyId"></param>
		/// <param name="userName"></param>
		/// <returns></returns>
		private async Task<bool> isOwner(int surveyId)
		{
			var survey = await this._unitOfWork.Surveys.GetAsync(surveyId);
			if (survey.Owner == this.User.Identity.Name)
			{
				return true;
			}
			else
			{
				return false;
			}

		}
	}
}