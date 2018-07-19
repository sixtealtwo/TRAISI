import { Label } from "../../models/label.model";

export class WelcomePage {
	constructor(
		public id?: number,
		public labelId?: number,
		public label?: Label,
		public surveyViewId?: number
	) {	}
}
