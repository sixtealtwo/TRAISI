import { Injectable } from '@angular/core';
import { UserGroupEndpointService } from './user-group-endpoint.service';
import { UserGroup } from '../models/user-group.model';
import { GroupMember } from '../models/group-member.model';
@Injectable()
export class UserGroupService
{

	constructor(private _userGroupEndpointService: UserGroupEndpointService)
		{

		}

		/**
		 * Lists all user groups.
		 */
		public listUserGroups()
		{
		return this._userGroupEndpointService.getListUserGroupsEndpoint<UserGroup[]>();

		}

		/**
		 * Creates a new user group with the passed user group details.
		 * @param  {UserGroup} userGroup
		 */
	public createUserGroup(userGroup: UserGroup)
	{
		return this._userGroupEndpointService.getCreateUserGroupEndpoint<UserGroup>(userGroup);
		}

		/**
		 * Edits (submits) updated user group information.
		 * @param  {UserGroup} userGroup UserGroup object with updated data.
		 */
		public editUserGroup(userGroup: UserGroup)
		{
		return this._userGroupEndpointService.getEditUserGroupEndpoint<UserGroup>(userGroup);
		}

		/**
		 * Deletes the indicated user group.
		 * @param  {number} id
		 */
		public deleteUserGroup(id: number)
		{
		return this._userGroupEndpointService.getDeleteUserGroupEndpoint<number>(id);
		}

		/**
		 * Retrieves user group with specified id.
		 * @param id
		 */
		public getUserGroup(id: number)
		{
		return this._userGroupEndpointService.getUserGroupEndpoint<UserGroup>(id);
	}

	public getUserGroupMembers(id: number) {
		return this._userGroupEndpointService.getUserGroupMembersEndpoint<GroupMember[]>(id);
	}

	/**
	 * Adds member to a group, specified in passed in object
	 * @param {GroupMember} memberInfo
	 */
	public addMemberToGroup(memberInfo: GroupMember) {
		return this._userGroupEndpointService.getAddMemberToUserGroupEndpoint<GroupMember>(memberInfo);
	}

	public removeMemberFromGroup(memberInfo: GroupMember) {
		return this._userGroupEndpointService.removeMemberFromGroupEndpoint<number>(memberInfo.id);
	}

	public removeMembersFromGroup(memberInfo: GroupMember[]) {
		return this._userGroupEndpointService.removeMembersFromGroupEndpoint<number>(memberInfo.map(m => m.id));
	}

}
