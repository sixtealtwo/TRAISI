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

		/// <summary>
		/// 
		/// </summary>
		/// <param name="_entityManager"></param>
		public UserGroupController(IUnitOfWork unitOfWork, IAuthorizationService authorizationService)
		{
			this._unitOfWork = unitOfWork;
			this._authorizationService = authorizationService;

		}

		/// <summary>
		/// Get user group by ID
		/// </summary>
		[HttpGet("{id}")]
		[Produces(typeof(UserGroupViewModel))]
		public async Task<IActionResult> GetGroup(int id)
		{
			var group = await this._unitOfWork.UserGroups.GetAsync(id);

			return Ok(Mapper.Map<UserGroupViewModel>(group));
		}

		/// <summary>
		/// Get all user group where member
		/// </summary>
		[HttpGet]
		[Produces(typeof(List<UserGroupViewModel>))]
		public async Task<IActionResult> GetGroups()
		{
			var viewAllUsersPolicy = await _authorizationService.AuthorizeAsync(this.User, Authorization.Policies.ViewAllUsersPolicy);
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
		/// Get all user group for super admin
		/// </summary>
		[HttpGet("admin")]
		[Produces(typeof(List<UserGroupViewModel>))]
		public async Task<IActionResult> GetGroupsForAdmin()
		{
			var viewAllUsersPolicy = await _authorizationService.AuthorizeAsync(this.User, Authorization.Policies.ViewAllUsersPolicy);
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

		[HttpGet("canAdmin")]
		[Produces(typeof(bool))]
		public async Task<IActionResult> CanAdminGroups()
		{
			var viewAllUsersPolicy = await _authorizationService.AuthorizeAsync(this.User, Authorization.Policies.ViewAllUsersPolicy);
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
		[Authorize (Authorization.Policies.ManageGroupSurveysPolicy)]
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
		[Authorize (Authorization.Policies.ManageGroupSurveysPolicy)]
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
		[Authorize (Authorization.Policies.ManageGroupSurveysPolicy)]
		public async Task<IActionResult> DeleteGroup(int id)
		{
			var removed = this._unitOfWork.UserGroups.Get(id);
			this._unitOfWork.UserGroups.Remove(removed);
			await this._unitOfWork.SaveChangesAsync();
			return new OkResult();
		}

		[HttpGet("{id}/members")]
		[Produces(typeof(List<GroupMemberViewModel>))]
		public async Task<IActionResult> GetGroupMembers(int id)
		{
			var groupMembers = await this._unitOfWork.UserGroups.GetGroupMembersInfoAsync(id);
			List<GroupMemberViewModel> groupMembersVM = new List<GroupMemberViewModel>();

			foreach (var member in groupMembers)
			{
				var groupMemberVM = Mapper.Map<GroupMemberViewModel>(member.Item1);
				groupMemberVM.User.Roles = member.Item2;
				groupMembersVM.Add(groupMemberVM);
			}
			return Ok(groupMembersVM);
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
			return BadRequest(ModelState);
		}

		[HttpPut("members")]
		[Authorize (Authorization.Policies.ManageAllUsersPolicy)]
		public async Task<IActionResult> UpdateGroupMember([FromBody] GroupMemberViewModel member)
		{
			GroupMember gMember = Mapper.Map<GroupMember>(member);
			this._unitOfWork.GroupMembers.Update(gMember);
			await this._unitOfWork.SaveChangesAsync();
			return new OkResult();
		}

		[HttpDelete("members/{id}")]
		public async Task<IActionResult> RemoveGroupMember(int id)
		{
			if (ModelState.IsValid)
			{
				// todo: check if user has permission (needs to be group admin)
				var member = this._unitOfWork.GroupMembers.Get(id);
				this._unitOfWork.GroupMembers.Remove(member);
				await this._unitOfWork.SaveChangesAsync();
				return new OkResult();
			}
			return BadRequest(ModelState);
		}

		[HttpDelete("members")]
		public async Task<IActionResult> RemoveGroupMembers([FromQuery] int[] ids)
		{
			if (ModelState.IsValid)
			{
								// todo: check if user has permission (needs to be group admin)
				foreach (int id in ids)
				{
					var member = this._unitOfWork.GroupMembers.Get(id);
					this._unitOfWork.GroupMembers.Remove(member);
				}
				await this._unitOfWork.SaveChangesAsync();
				return new OkResult();
			}
			return BadRequest(ModelState);
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
