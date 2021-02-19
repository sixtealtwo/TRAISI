import { Inject, Injectable, Injector } from '@angular/core';
import { TraisiValues, SurveyRespondent, SurveyResponseService } from 'traisi-question-sdk';
import { TravelDiarySchedulerConfiguration } from 'travel-diary-scheduler/models/config.model';
import { PurposeLocation } from 'travel-diary-scheduler/models/purpose-location.model';
import { RespondentData } from 'travel-diary-scheduler/models/respondent-data.model';

@Injectable()
export class TravelDiaryScheduleRespondentDataService {
	public respondentData: RespondentData;

	/**
	 *
	 * @param _primaryRespondent
	 * @param _respondent
	 * @param _configuration
	 * @param _responseService
	 * @param _injector
	 */
	public constructor(
		@Inject(TraisiValues.PrimaryRespondent) private _primaryRespondent: SurveyRespondent,
		@Inject(TraisiValues.Respondent) private _respondent: SurveyRespondent,
		@Inject(TraisiValues.Configuration) private _configuration: TravelDiarySchedulerConfiguration,
		@Inject(TraisiValues.SurveyResponseService) private _responseService: SurveyResponseService,
		private _injector: Injector
	) {
		this.initialize();
	}

	public initialize(): void {
		this.respondentData = {
			workLocations: [],
			schoolLocations: [],
		};

		let workLocations = [];
		let schoolLocations = [];
		// load work locations
		for (let workLocation of this._configuration.workLocations) {
			let workQuestion = this._injector.get('question.' + workLocation.label);
			workLocations.push(workQuestion);
		}

		for (let schoolLocation of this._configuration.schoolLocations) {
			let schoolQuestion = this._injector.get('question.' + schoolLocation.label);
			schoolLocations.push(schoolQuestion);
		}
		this._responseService
			.loadSavedResponsesForRespondents(schoolLocations.concat(workLocations), [this._respondent])
			.subscribe((results) => {
				console.log(results);
				this.respondentData.schoolLocations = results
					.filter((r) => schoolLocations.some((x) => x.questionId == r.questionId))
					.map((x) => {
						return { purpose: 'work', address: x.responseValues[0].address };
					}) as any[];
				this.respondentData.workLocations = results
					.filter((r) => workLocations.some((x) => x.questionId == r.questionId))
					.map((x) => {
						return { purpose: 'work', address: x.responseValues[0].address };
					}) as any[];
				console.log(this.respondentData);
			});
	}
}
