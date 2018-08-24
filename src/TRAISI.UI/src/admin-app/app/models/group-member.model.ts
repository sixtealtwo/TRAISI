import { UserGroup } from './user-group.model';
import { User } from './user.model';

export class GroupMember {

	constructor(public id?: number,
		public userName?: string,
		public user?: User,
		public group?: string,
		public dateJoined?: Date,
		public groupAdmin?: boolean) {

		}
}
