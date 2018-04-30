import { SurveyGroup } from "./survey-group.model";
import { GroupRole } from "./group-role.model";
import { User } from "./user.model";

export class GroupMember {

	constructor(private _id?: number,
		private _group?: SurveyGroup,
		private _role?: GroupRole,
		private _user?: User,
		private _dateJoined?: Date) {

	}
}
