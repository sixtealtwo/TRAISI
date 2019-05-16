
import { SurveyNavigator } from './survey-navigator.service';
import { } from 'jasmine';

describe('SurveyNavigator', () => {

	let navigator: SurveyNavigator;

	beforeEach(() => { navigator = new SurveyNavigator(null); });

	it('#getValue should return real value', () => {

		navigator.navigationStateChanged.subscribe(value => {
			expect(value).toEqual(null);
		});

	  });

});
