// import { } from 'jasmine';
import { ConditionalEvaluator } from "./conditional-evaluator.service";
import { QuestionConditionalOperator } from "../../models/question-conditional-operator.model";

describe("ConditionalEvaluator", () => {
	let conditionalEvaluator: ConditionalEvaluator;

	beforeEach(() => {
		conditionalEvaluator = new ConditionalEvaluator(null, null);
	});

	it("it should be defined", () => {
		expect(conditionalEvaluator).toBeDefined();
	});

	it("should evaluate conditional list properly"),
		() => {
			let conditional: QuestionConditionalOperator = {
				lhs: {}
			};
			conditionalEvaluator.evaluateConditionalList([conditional],0);
		};
});
