
import { SurveyNavigator } from './survey-navigator.service';
// import { } from 'jasmine';

describe('SurveyNavigator', () => {

	let navigator: SurveyNavigator;

	beforeEach(() => { navigator = new SurveyNavigator(null,null); });

	it('initial navigation state should be null', () => {

		navigator.navigationStateChanged.subscribe(value => {
			expect(value).toEqual(null);
		});

	});

	it('initial navigation state should be null', () => {

		navigator.navigationStateChanged.subscribe(value => {
			expect(value).toEqual(null);
		});

	});

});
