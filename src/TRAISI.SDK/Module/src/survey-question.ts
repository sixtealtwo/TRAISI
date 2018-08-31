/**
 *
 * @param constructor
 * @constructor
 */
export function SurveyQuestion<T extends { new(...args: any[]): {} }>(constructor: T) {
	return class extends constructor {

	};
}