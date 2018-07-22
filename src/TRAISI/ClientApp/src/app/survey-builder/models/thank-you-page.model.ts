import { Label } from '../../models/label.model';

export class ThankYouPage {
	constructor(
		public id?: number,
		public labelId?: number,
		public label?: Label,
		public surveyViewId?: number
	) {	}
}
