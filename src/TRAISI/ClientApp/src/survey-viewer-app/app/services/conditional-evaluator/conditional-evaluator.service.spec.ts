
// import { } from 'jasmine';
import { ConditionalEvaluator } from './conditional-evaluator.service';

describe('SurveyNavigator', () => {

	let conditionalEvaluator: ConditionalEvaluator;

	beforeEach(() => { conditionalEvaluator = new ConditionalEvaluator(null,null); });

	it('it should be defined', () => {

		expect(conditionalEvaluator).toBeDefined();

	});

});
