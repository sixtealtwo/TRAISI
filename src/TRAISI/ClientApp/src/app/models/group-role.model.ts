import { CreateSurveys } from "./enums";


export class GroupRole
{
	constructor(private _id?: number,
	private _createSurveys?: CreateSurveys,
	private _isAdmin?: boolean,
	private _name?: string)
	{

	}

}
