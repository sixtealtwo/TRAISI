import { Label } from "../../models/label.model";

export class TermsAndConditionsPage {
	constructor(
		public id?: number,
		public labelId?: number,
		public label?: Label,
		public surveyViewId?: number
	) {	}
}
