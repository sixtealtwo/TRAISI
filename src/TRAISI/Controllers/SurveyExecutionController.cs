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
using System.Text.RegularExpressions;
using FluentValidation.Results;

namespace TRAISI.Controllers
{
	[Authorize]
	[Route("api/[controller]")]
	public class SurveyExecutionController : Controller
	{

		private IUnitOfWork _unitOfWork;
		private readonly IAuthorizationService _authorizationService;
		private readonly IAccountManager _accountManager;
		private readonly ICodeGeneration _codeGeneration;

		public SurveyExecutionController(IUnitOfWork unitOfWork, IAuthorizationService authorizationService, IAccountManager accountManager, ICodeGeneration CodeGenerationService)
		{
			this._unitOfWork = unitOfWork;
			this._authorizationService = authorizationService;
			this._accountManager = accountManager;
			this._codeGeneration = CodeGenerationService;
		}

		/// <summary>
		/// Get all shortcodes for survey
		/// </summary>
		/// <param name="id"></param>
		/// <param name="mode"></param>
		/// <returns></returns>
		[HttpGet("{id}/{mode}")]
		[Produces(typeof(List<Shortcode>))]
		public async Task<IActionResult> GetSurveyShortcodes(int id, string mode)
		{
			return await this.GetSurveyShortcodes(id,mode,-1,-1);
		}

		/// <summary>
		/// Gets shortcodes for survey (with page passed in)
		/// </summary>
		/// <param name="id"></param>
		/// <param name="mode"></param>
		/// <param name="pageIndex"></param>
		/// <param name="pageSize"></param>
		/// <returns></returns>
		[HttpGet("{id}/{mode}/{pageIndex}/{pageSize}")]
		[Produces(typeof(List<Shortcode>))]
		public async Task<IActionResult> GetSurveyShortcodes(int id, string mode, int pageIndex, int pageSize)
		{
			var survey = await this._unitOfWork.Surveys.GetAsync(id);
			if(survey.Owner == this.User.Identity.Name || await hasExecuteSurveyPermissions(id))
			{
				var shortcodes = await this._unitOfWork.Shortcodes.GetShortcodesForSurveyAsync(id, mode=="test", pageIndex, pageSize);
				return Ok(Mapper.Map<IEnumerable<ShortcodeViewModel>>(shortcodes));
			}
			else
			{
				return BadRequest("User does not have permissions to execute this survey.");
			}
		}

		[HttpGet("{id}/{mode}/count")]
		[Produces(typeof(int))]
		public async Task<IActionResult> GetNumberSurveyShortCodes(int id, string mode)
		{
			var survey = await this._unitOfWork.Surveys.GetAsync(id);
			if(survey.Owner == this.User.Identity.Name || await hasExecuteSurveyPermissions(id))
			{
				var numCodes = await this._unitOfWork.Shortcodes.GetCountOfShortcodesForSurveyAsync(id, mode=="test");
				return Ok(numCodes);
			}
			else
			{
				return BadRequest("User does not have permissions to execute this survey.");
			}
		}


		/// <summary>
		/// Get all group codes for survey
		/// </summary>
		/// <param name="id"></param>
		/// <param name="mode"></param>
		/// <returns></returns>
		[HttpGet("{id}/groupcode/{mode}")]
		[Produces(typeof(List<GroupCode>))]
		public async Task<IActionResult> GetSurveyGroupCodes(int id, string mode)
		{
			return await this.GetSurveyGroupCodes(id, mode, -1, -1);
		}

		[HttpGet("{id}/groupcode/{mode}/{pageIndex}/{pageSize}")]
		[Produces(typeof(List<GroupCode>))]
		public async Task<IActionResult> GetSurveyGroupCodes(int id, string mode, int pageIndex, int pageSize)
		{
			var survey = await this._unitOfWork.Surveys.GetAsync(id);
			if(survey.Owner == this.User.Identity.Name || await hasExecuteSurveyPermissions(id))
			{
				var groupcodes = await this._unitOfWork.GroupCodes.GetGroupCodesForSurveyAsync(id, mode=="test", pageIndex, pageSize);
				return Ok(Mapper.Map<IEnumerable<GroupCodeViewModel>>(groupcodes));
			}
			else
			{
				return BadRequest("User does not have permissions to execute this survey.");
			}
		}


		[HttpGet("{id}/groupcode/{mode}/count")]
		[Produces(typeof(int))]
		public async Task<IActionResult> GetNumberSurveyGroupCodes(int id, string mode)
		{
			var survey = await this._unitOfWork.Surveys.GetAsync(id);
			if(survey.Owner == this.User.Identity.Name || await hasExecuteSurveyPermissions(id))
			{
				var numCodes = await this._unitOfWork.GroupCodes.GetCountOfGroupCodesForSurveyAsync(id, mode=="test");
				return Ok(numCodes);
			}
			else
			{
				return BadRequest("User does not have permissions to execute this survey.");
			}
		}


		/// <summary>
		/// Generate short codes for survey
		/// </summary>
		/// <param name="codeGeneration"></param>
		/// <returns></returns>
		[HttpPost]
		public async Task<IActionResult> CreateShortcodes([FromBody] CodeGenerationViewModel codeParameters)
		{
			if (ModelState.IsValid)
				{	
					var survey = await this._unitOfWork.Surveys.GetAsync(codeParameters.SurveyId);
					//CodeGenerationViewModelValidator validator = new CodeGenerationViewModelValidator();
					//var result = validator.Validate(codeParameters);
					CodeGeneration codeGenerationParameters = Mapper.Map<CodeGeneration>(codeParameters);
					if(survey.Owner == this.User.Identity.Name || await hasExecuteSurveyPermissions(codeParameters.SurveyId))
					{	
						this._codeGeneration.generateShortCodes(codeGenerationParameters, survey);
						await this._unitOfWork.SaveChangesAsync();
						return new OkResult();
					}
					return BadRequest("User does not have permissions to execute this survey.");
			}
				return BadRequest(ModelState);
		}

		/// <summary>
		/// Generate group codes for survey
		/// </summary>
		/// <param name="codeParameters"></param>
		/// <returns></returns>
		[HttpPost("groupcode")]
		public async Task<IActionResult> CreateGroupCodes([FromBody] CodeGenerationViewModel codeParameters)
		{
			if (ModelState.IsValid)
				{	
					var survey = await this._unitOfWork.Surveys.GetAsync(codeParameters.SurveyId);
					CodeGeneration codeGenerationParameters = Mapper.Map<CodeGeneration>(codeParameters);
					if(survey.Owner == this.User.Identity.Name || await hasExecuteSurveyPermissions(codeParameters.SurveyId))
					{	
						this._codeGeneration.generateGroupCodes(codeGenerationParameters, survey);
						await this._unitOfWork.SaveChangesAsync();
						return new OkResult();
					}
					return BadRequest("User does not have permissions to execute this survey.");
			}
				return BadRequest(ModelState);
		}


		/// <summary>
		/// Check if user is group admin of given group
		/// </summary>
		/// <param name="id"></param>
		/// <param name="user"></param>
		/// <returns></returns>
		private async Task<bool> isGroupAdmin(string groupName)
		{
			var isGroupAdmin = await this._unitOfWork.GroupMembers.IsGroupAdminAsync(this.User.Identity.Name, groupName);
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

		/// <summary>
		/// Check if user has execute survey permissions
		/// </summary>
		/// <param name="surveyId"></param>
		/// <returns></returns>
		private async Task<bool> hasExecuteSurveyPermissions (int surveyId)
		{
			var surveyPermissions = await this._unitOfWork.SurveyPermissions.GetPermissionsForSurveyAsync(this.User.Identity.Name, surveyId);
			bool hasExecuteSurveyPermissions = surveyPermissions.Permissions.Contains("survey.execute");
			return hasExecuteSurveyPermissions;
		}
	}
}