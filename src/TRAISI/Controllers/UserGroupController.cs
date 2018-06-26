// ====================================================
// More Templates: https://www.ebenmonney.com/templates
// Email: support@ebenmonney.com
// ====================================================

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DAL;
using TRAISI.ViewModels;
using AutoMapper;
using DAL.Core.Interfaces;
using DAL.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using TRAISI.Helpers;
using Microsoft.Extensions.Options;
using TRAISI.Authorization;

namespace TRAISI.Controllers
{
	[Authorize]
	[Route("api/[controller]")]
	public class UserGroupController : Controller
	{

		private IUnitOfWork _unitOfWork;
		private readonly IAuthorizationService _authorizationService;
		private readonly IAccountManager _accountManager;

		/// <summary>
		/// 
		/// </summary>
		/// <param name="_entityManager"></param>
		public UserGroupController(IUnitOfWork unitOfWork, IAuthorizationService authorizationService, IAccountManager accountManager)
		{
			this._unitOfWork = unitOfWork;
			this._authorizationService = authorizationService;
			this._accountManager = accountManager;
		}

		/// <summary>
		/// Get user group by ID
		/// </summary>
		[HttpGet("{id}")]
		[Produces(typeof(UserGroupViewModel))]
		public async Task<IActionResult> GetGroup(int id)
		{
			var group = await this._unitOfWork.UserGroups.GetGroupWithMembersAsync(id);
			//two user types can access: superadmin or any group member
			var viewAllUsersPolicy = await _authorizationService.AuthorizeAsync(this.User, Authorization.Policies.ViewAllUsersPolicy);
			if (viewAllUsersPolicy.Succeeded)
			{
				return Ok(Mapper.Map<UserGroupViewModel>(group));
			}
			else
			{
				var memberOfGroup = await this._unitOfWork.GroupMembers.IsMemberOfGroup(this.User.Identity.Name, group.Name);
				if (memberOfGroup)
				{
					return Ok(Mapper.Map<UserGroupViewModel>(group));
				}
				else
				{
					return new ChallengeResult();
				}
			}
		}

		/// <summary>
		/// Get all user group where member
		/// </summary>
		[HttpGet]
		[Produces(typeof(List<UserGroupViewModel>))]
		public async Task<IActionResult> GetGroups()
		{
			var viewAllUsersPolicy = await _authorizationService.AuthorizeAsync(this.User, Authorization.Policies.ManageAllGroupsPolicy);
			IEnumerable<UserGroup> groups;
			if (viewAllUsersPolicy.Succeeded)
			{
				groups = await this._unitOfWork.UserGroups.GetAllGroupsAsync();
			}
			else
			{
				groups = await this._unitOfWork.UserGroups.GetAllGroupsWhereMemberAsync(this.User.Identity.Name);
			}
			return Ok(Mapper.Map<IEnumerable<UserGroupViewModel>>(groups));
		}

		/// <summary>
		/// Get all user groups where group admin
		/// </summary>
		[HttpGet("admin")]
		[Produces(typeof(List<UserGroupViewModel>))]
		public async Task<IActionResult> GetGroupsForAdmin()
		{
			var viewAllUsersPolicy = await _authorizationService.AuthorizeAsync(this.User, Authorization.Policies.ManageAllGroupsPolicy);
			IEnumerable<UserGroup> groups;
			if (viewAllUsersPolicy.Succeeded)
			{
				groups = await this._unitOfWork.UserGroups.GetAllGroupsAsync();
			}
			else
			{
				groups = await this._unitOfWork.UserGroups.GetAllGroupsForAdminAsync(this.User.Identity.Name);
			}
			return Ok(Mapper.Map<IEnumerable<UserGroupViewModel>>(groups));
		}

		/// <summary>
		/// Check if admin for one or more groups
		/// </summary>
		/// <returns></returns>
		[HttpGet("canAdmin")]
		[Produces(typeof(bool))]
		public async Task<IActionResult> CanAdminGroups()
		{
			var viewAllUsersPolicy = await _authorizationService.AuthorizeAsync(this.User, Authorization.Policies.ManageAllGroupsPolicy);
			IEnumerable<UserGroup> groups;
			if (viewAllUsersPolicy.Succeeded)
			{
				return Ok(true);
			}
			else
			{
				groups = await this._unitOfWork.UserGroups.GetAllGroupsForAdminAsync(this.User.Identity.Name);
				return Ok(groups.Count() > 0);
			}
		}

		/// <summary>
		/// Create user group
		/// </summary>
		[HttpPost]
		[Authorize(Authorization.Policies.ManageAllGroupsPolicy)]
		public async Task<IActionResult> CreateGroup([FromBody] UserGroupViewModel group)
		{
			if (ModelState.IsValid)
			{
				if (group == null)
				{
					return BadRequest($"{nameof(group)} cannot be null");
				}

				UserGroup appUserGroup = Mapper.Map<UserGroup>(group);

				await this._unitOfWork.UserGroups.AddAsync(appUserGroup);
				await this._unitOfWork.SaveChangesAsync();
				return new OkResult();
			}

			return BadRequest(ModelState);
		}

		/// <summary>
		/// Update a user group
		/// </summary>
		[HttpPut]
		[Authorize(Authorization.Policies.ManageAllGroupsPolicy)]
		public async Task<IActionResult> UpdateGroup([FromBody] UserGroupViewModel group)
		{
			if (ModelState.IsValid)
			{
				UserGroup appUserGroup = Mapper.Map<UserGroup>(group);

				this._unitOfWork.UserGroups.Update(appUserGroup);
				await this._unitOfWork.SaveChangesAsync();
				return new OkResult();
			}
			return BadRequest(ModelState);
		}


		/// <summary>
		/// Delete a user group
		/// </summary>
		[HttpDelete("{id}")]
		[Authorize(Authorization.Policies.ManageAllGroupsPolicy)]
		public async Task<IActionResult> DeleteGroup(int id)
		{
			var removed = this._unitOfWork.UserGroups.Get(id);
			this._unitOfWork.UserGroups.Remove(removed);
			await this._unitOfWork.SaveChangesAsync();
			return new OkResult();
		}

		/// <summary>
		/// Get members within group
		/// </summary>
		/// <param name="id"></param>
		/// <returns></returns>
		[HttpGet("{id}/members")]
		[Produces(typeof(List<GroupMemberViewModel>))]
		public async Task<IActionResult> GetGroupMembers(int id)
		{
			var group = await this._unitOfWork.UserGroups.GetAsync(id);
			var groupMembers = await this._unitOfWork.UserGroups.GetGroupMembersInfoAsync(id);

			if (group == null || groupMembers == null) {
				return BadRequest($"Group {id} does not exist");
			}
			bool canAccess = false;
			//two user types can access: superadmin or any group member
			var viewAllUsersPolicy = await _authorizationService.AuthorizeAsync(this.User, Authorization.Policies.ViewAllUsersPolicy);
			if (viewAllUsersPolicy.Succeeded)
			{
				canAccess = true;
			}
			else
			{
				bool memberOfGroup = groupMembers.Where(m => m.Item1.UserName == this.User.Identity.Name).Any();
				if (memberOfGroup)
				{
					canAccess = true;
				}
			}

			if (canAccess)
			{
				List<GroupMemberViewModel> groupMembersVM = new List<GroupMemberViewModel>();

				foreach (var member in groupMembers)
				{
					var groupMemberVM = Mapper.Map<GroupMemberViewModel>(member.Item1);
					groupMemberVM.User.Roles = member.Item2;
					groupMembersVM.Add(groupMemberVM);
				}
				return Ok(groupMembersVM);
			}
			else
			{
				return new ChallengeResult();
			}
		}

		/// <summary>
		/// Adds a new member to the user group
		/// </summary>
		/// <param name="newMember"></param>
		/// <returns></returns>
		[HttpPost("members")]
		public async Task<IActionResult> AddGroupMember([FromBody] GroupMemberViewModel newMember)
		{
			if (ModelState.IsValid)
			{
				bool groupAdminHasPermission = await this.CheckGroupAdminPermission("users.managegroup");
				var isGroupAdmin = groupAdminHasPermission && await this._unitOfWork.GroupMembers.IsGroupAdmin(this.User.Identity.Name, newMember.Group);
				var isSuperAdmin = (await _authorizationService.AuthorizeAsync(this.User, Authorization.Policies.ManageAllGroupsPolicy)).Succeeded;
				if (isGroupAdmin || isSuperAdmin) {
					GroupMember newGMember = Mapper.Map<GroupMember>(newMember);
					var result = this._unitOfWork.UserGroups.AddUser(newGMember);
					if (result.Item1)
					{
						await this._unitOfWork.SaveChangesAsync();
						return new OkResult();
					}
					else
					{
						AddErrors(result.Item2);
					}
				}
				else {
					return new ChallengeResult();
				}
			}
			return BadRequest(ModelState);
		}

		/// <summary>
		/// Update member within any group. Restricted to super administrators only.
		/// </summary>
		/// <param name="member"></param>
		/// <returns></returns>
		[HttpPut("members")]
		[Authorize(Authorization.Policies.ManageAllUsersPolicy)]
		public async Task<IActionResult> UpdateGroupMember([FromBody] GroupMemberViewModel member)
		{
			GroupMember gMember = Mapper.Map<GroupMember>(member);
			this._unitOfWork.GroupMembers.Update(gMember);
			await this._unitOfWork.SaveChangesAsync();
			return new OkResult();
		}

		/// <summary>
		/// Delete group member. Restricted to group admins and super admins.
		/// </summary>
		/// <param name="id"></param>
		/// <returns></returns>
		[HttpDelete("members/{id}")]
		public async Task<IActionResult> RemoveGroupMember(int id)
		{
			if (ModelState.IsValid)
			{
				bool groupAdminHasPermission = await this.CheckGroupAdminPermission("users.managegroup");
				var member = this._unitOfWork.GroupMembers.Get(id);
				if (member == null) 
				{
					return BadRequest("The member does not exist.");
				}
				else {
					var isGroupAdmin = groupAdminHasPermission && await this._unitOfWork.GroupMembers.IsGroupAdmin(this.User.Identity.Name, member.Group);
					var isSuperAdmin = (await _authorizationService.AuthorizeAsync(this.User, Authorization.Policies.ManageAllGroupsPolicy)).Succeeded;
					if (isGroupAdmin || isSuperAdmin) {
						this._unitOfWork.GroupMembers.Remove(member);
						await this._unitOfWork.SaveChangesAsync();
						return new OkResult();
					}
					else {
							return new ChallengeResult();
					}
				}
			}
			return BadRequest(ModelState);
		}

		/// <summary>
		/// Delete several group members
		/// </summary>
		/// <param name="ids"></param>
		/// <returns></returns>
		[HttpDelete("members")]
		public async Task<IActionResult> RemoveGroupMembers([FromQuery] int[] ids)
		{
			List<int> removalsWithErrors = new List<int>();

			if (ModelState.IsValid)
			{
				var isSuperAdmin = (await _authorizationService.AuthorizeAsync(this.User, Authorization.Policies.ManageAllGroupsPolicy)).Succeeded;
				bool groupAdminHasPermission = await this.CheckGroupAdminPermission("users.managegroup");

				foreach (int id in ids)
				{
					var member = this._unitOfWork.GroupMembers.Get(id);
					if (member == null) {
						removalsWithErrors.Add(id);
					}
					else {
						if (isSuperAdmin) {
							this._unitOfWork.GroupMembers.Remove(member);
						}
						else {
							var isGroupAdmin = groupAdminHasPermission && await this._unitOfWork.GroupMembers.IsGroupAdmin(this.User.Identity.Name, member.Group);
							if (isGroupAdmin) {
								this._unitOfWork.GroupMembers.Remove(member);
							}
							else {
								removalsWithErrors.Add(id);
							}
						}
					}
				}
				await this._unitOfWork.SaveChangesAsync();
				if (removalsWithErrors.Count == 0){
					return new OkResult();
				}
				else {
					if (removalsWithErrors.Count < ids.Count()) {
						return Ok("Some members removed, but cannot delete group members: " + String.Join(",", removalsWithErrors));
					}
					else 
					{
						return BadRequest("Members do not exist in groups or insufficient privelages");
					}
				}
			}
			return BadRequest(ModelState);
		}

		/// <summary>
		/// Get API keys for given group
		/// </summary>
		/// <param name="id"></param>
		/// <returns></returns>
		[HttpGet("{id}/apikeys")]
		[Produces(typeof(ApiKeysViewModel))]
		public async Task<IActionResult> GetGroupApiKeys(int id)
		{
			var group = await this._unitOfWork.UserGroups.GetGroupWithMembersAsync(id);
			var apiKeys = await this._unitOfWork.ApiKeys.GetGroupApiKeys(id);

			if (await isGroupAdmin(group.Name))
			{
				return Ok(Mapper.Map<ApiKeysViewModel>(apiKeys));
			}
			else
			{
				return new ChallengeResult();
			}
		}

		/// <summary>
		/// Update group API keys
		/// </summary>
		/// <param name="apiKeys"></param>
		/// <returns></returns>
		[HttpPost("{id}/apikeys")]
		public async Task<IActionResult> UpdateGroupApiKeys([FromBody] ApiKeysViewModel apiKeys)
		{
			var group = await this._unitOfWork.UserGroups.GetGroupWithMembersAsync(apiKeys.GroupId);
			if (await isGroupAdmin(group.Name))
			{
				ApiKeys gApiKeys = Mapper.Map<ApiKeys>(apiKeys);
				//gApiKeys.Group = group;
				this._unitOfWork.ApiKeys.Update(gApiKeys);
				await this._unitOfWork.SaveChangesAsync();
				return new OkResult();
			}
			else
			{
				return BadRequest("Insufficient privileges.");
			}
		}

		/// <summary>
		/// Check if user is group admin
		/// </summary>
		/// <param name="groupName"></param>
		/// <returns></returns>
		private async Task<bool> isGroupAdmin(string groupName)
		{
			var isGroupAdmin = await this._unitOfWork.GroupMembers.IsGroupAdmin(this.User.Identity.Name, groupName);
			return isGroupAdmin;
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

		private void AddErrors(IEnumerable<string> errors)
		{
			foreach (var error in errors)
			{
				ModelState.AddModelError(string.Empty, error);
			}
		}

	}
}
