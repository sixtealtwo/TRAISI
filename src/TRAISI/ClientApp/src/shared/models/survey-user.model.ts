import { User } from 'shared/models/user.model';

export class SurveyUser extends User
{
	public surveyId: number;
	public shortcode: string;

}
