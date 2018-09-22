import { QuestionResponseState } from './question-response-state';
import { EventEmitter } from '@angular/core';
import { QuestionConfiguration } from './question-configuration';

export namespace TRAISI {
	export abstract class SurveyQuestion<T extends ResponseTypes> {
		public abstract get typeName(): string;

		public abstract get icon(): string;

		state: QuestionResponseState;

		public response: EventEmitter<ResponseData<T>>;

		configuration: QuestionConfiguration;

		isValid: boolean;

		data: Array<any>;

		constructor() {
			this.state = QuestionResponseState.PRISTINE;
			this.response = new EventEmitter<ResponseData<T>>();
			this.configuration = <QuestionConfiguration>{};
			this.isValid = false;
			this.data = [];
		}
	}

	/**
	 *
	 *
	 * @export
	 * @interface TraisiBuildable
	 */
	export interface TraisiBuildable {
		typeName: string;
		icon: string;
	}

	export abstract class ResponseData<T extends ResponseData<ResponseTypes.String>> {}

	export interface StringResponseData extends ResponseData<ResponseTypes.String> {
		value: string;
	}

	export interface DecimalResponseData extends ResponseData<ResponseTypes.Decminal> {
		value: number;
	}

	export interface IntegerResponseData extends ResponseData<ResponseTypes.Integer> {
		value: number;
	}

	export interface TimeResponseData extends ResponseData<ResponseTypes.Time> {
		value: Date;
	}

	export interface DateResponseData extends ResponseData<ResponseTypes.Date> {
		value: Date;
	}

	export interface LocationResponseData extends ResponseData<ResponseTypes.Location> {
		latitude: number;
		longitude: number;
		address: string;
	}

	export interface TimelineResponseData extends ResponseData<ResponseTypes.Timeline> {
		latitude: number;
		longitude: number;
		address: string;
		time: Date;
		purpose: string;
	}

	export interface RangeResponseData extends ResponseData<ResponseTypes.Range> {
		min: number;
		max: number;
	}

	export interface BooleanResponseData extends ResponseData<ResponseTypes.Boolean> {
		value: boolean;
	}

	export interface ListResponseData extends ResponseData<ResponseTypes.List> {
		values: Array<any>;
	}

	/**
	 *
	 *
	 * @export
	 * @enum {number}
	 */
	export enum ResponseTypes {
		Location = 'location',
		String = 'string',
		Integer = 'integer',
		Time = 'time',
		Date = 'date',
		Timeline = 'timeline',
		Decminal = 'decimal',
		Json = 'json',
		Range = 'Range',
		List = 'List',
		Boolean = 'boolean',
		None = 'none'
	}
}
