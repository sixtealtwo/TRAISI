
import { } from 'jasmine';
import { RepeatEvaluator } from './repeat-evaluator.service';

describe('SurveyNavigator', () => {

	let repeatEvaluator: RepeatEvaluator;

	beforeEach(() => { repeatEvaluator = new RepeatEvaluator(); });

	it('it should be defined', () => {

		expect(repeatEvaluator).toBeDefined();

	});

});
