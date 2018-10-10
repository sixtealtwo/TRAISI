import { ResponseValidationState } from './question-response-state';
import { EventEmitter, Output, Inject, ChangeDetectorRef } from '@angular/core';
import { QuestionConfiguration } from './question-configuration';
import { QuestionLoaderService } from './question-loader.service';
import { BehaviorSubject, ReplaySubject } from 'rxjs';

/**
 * Base abstract class for Survey Questions available to TRAISI
 */
export abstract class SurveyQuestion<T extends ResponseTypes> {

	public abstract get typeName(): string;

	public abstract get icon(): string;

	/**
	 * Output binding - question components embedded in other question types can subscribe
	 * to the questions response event to receive the generated "data" of that question type
	 * when it is completed by the user.
	 * @type {EventEmitter<ResponseData<T>>}
	 * @memberof SurveyQuestion
	 */
	@Output()
	public readonly response: EventEmitter<ResponseData<T>>;

	@Output()
	public readonly validationState: EventEmitter<ResponseValidationState>;

	/**
	 * This value is id associated with the survey question. Each id will be unique.
	 */
	questionId: number;

	/**
	 * The configuration for this question
	 */
	configuration: QuestionConfiguration;

	/**
	 * The validity state of the question
	 */
	isValid: boolean;

	/**
	 * The saved response - if any
	 */
	savedResponse: ReplaySubject<ResponseData<T> | "none">;

	data: Array<any>;

	/**
	 *
	 *
	 * @private
	 * @param {QuestionConfiguration} configuration
	 * @memberof SurveyQuestion
	 */
	public loadConfiguration(configuration: QuestionConfiguration): void {
		this.configuration = configuration;
	}

	/**
	 * 
	 */
	constructor() {
		this.response = new EventEmitter<ResponseData<T>>();
		this.validationState = new EventEmitter<ResponseValidationState>();
		this.savedResponse = new ReplaySubject<ResponseData<T> | "none">(1);
		this.questionId = 0;
		this.configuration = <QuestionConfiguration>{};
		this.isValid = false;
		this.data = [];
	}

	/**
	 * A question can override this method to signal to the survey viewer that
	 * the question implements special next functionality.
	 */
	public canNavigateInternalNext(): boolean {
		return false;
	}

	/**
	 * An override to signal to the viewer that this question has an internal navigation
	 * handler.
	 */
	public canNavigateInternalPrevious(): boolean {
		return false;
	}

	/**
	 * Called when the next is triggered in the survey viewer.
	 */
	public navigateInternalNext(): boolean {
		return true;
	}

	/**
	 * Called when previous is triggered in the survey viewer.
	 */
	public navigateInternalPrevious(): void {}

	/**
	 *
	 *
	 * @memberof SurveyQuestion
	 */
	public traisiOnInit() {}

	/**
	 * Called when the question has completed loading all of its data.
	 * This includes any saved response data and configuration data.
	 */
	public traisiOnLoaded() {

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
 * Wrapper interface format for save response returned from survey - responseValue in includes the dat
 */
export interface ResponseValue<T extends ResponseTypes> {
	responseValue: ResponseData<T>;
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
