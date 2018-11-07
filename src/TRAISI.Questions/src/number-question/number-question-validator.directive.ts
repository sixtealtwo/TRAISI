import { NG_VALIDATORS, Validator, AbstractControl, FormGroup, FormControl } from '@angular/forms';
import { Directive, Input } from '@angular/core';

@Directive({
	selector: '[traisiNumberValidator]',
	providers: [{ provide: NG_VALIDATORS, useExisting: NumberQuestionValidatorDirective, multi: true }]
})
export class NumberQuestionValidatorDirective implements Validator {
	@Input('numberValidator')
	value: number;

	/**
	 * Validates number question validator directive
	 * @param control
	 * @returns validate
	 */
	validate(control: FormControl): { [key: string]: any } | null {
		console.log('in validate');

		console.log(control);

		return null;
	}
}
