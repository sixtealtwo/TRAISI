import { Injectable, Inject, Injector } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { Subject, BehaviorSubject, Observable, concat, of } from 'rxjs';
import { TravelDiaryConfiguration } from '../models/travel-diary-configuration.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap, map } from 'rxjs/operators';
import { formatRelative } from 'date-fns';
import {
	SurveyRespondentService,
	SurveyRespondent,
	SurveyResponseService,
	QuestionResponseType,
	ResponseTypes,
	TraisiValues,
	LocationResponseData,
	SurveyViewQuestion,
	SurveyViewerLogicRuleViewModel,
	TimelineResponseData,
} from 'traisi-question-sdk';
import { User } from '../components/day-view-scheduler.component';
import { Console } from 'console';
import { TravelDiaryEditDialogComponent } from '../components/travel-diary-edit-dialog.component';
import { colors } from '../models/consts';
import { url } from 'inspector';
import { get } from 'http';
import { NumberQuestionConfiguration } from 'general/viewer/number-question/number-question.configuration';

@Injectable()
export class TravelDiaryService {
	public diaryEvents$: BehaviorSubject<CalendarEvent[]>;

	public configuration: TravelDiaryConfiguration = {
		purpose: [],
		mode: [],
		homeAllDay: undefined,
		homeDeparture: undefined,
		returnHome: undefined,
	};

	public addresses$: Observable<string[]>;

	public addressInput$: Subject<string> = new Subject<string>();

	public addressesLoading: boolean = false;

	public respondents = [];

	public isLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	public users: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);

	public surveyId: number;

	public responseData: { [userId: number]: ResponseTypes.Location };

	private _diaryEvents: CalendarEvent[] = [];

	public constructor(
		private _http: HttpClient,
		@Inject(TraisiValues.SurveyRespondentService) private _respondentService: SurveyRespondentService,
		@Inject(TraisiValues.SurveyResponseService) private _responseService: SurveyResponseService,
		@Inject(TraisiValues.SurveyId) private _surveyId: number,
		@Inject(TraisiValues.Configuration) private _configuration: any,
		@Inject(TraisiValues.Respondent) private _respondent: SurveyRespondent,
		@Inject(TraisiValues.Household) private _respondents: SurveyRespondent[],
		private _injector: Injector
	) {
		this.diaryEvents$ = new BehaviorSubject<CalendarEvent[]>([]);
		console.log(this);
	}

	/**
	 *
	 *
	 * @param {SurveyRespondent} respondent
	 * @param {*} configuration
	 */
	public initialize(): void {
		this.configuration = Object.assign({}, this._configuration);
		this.configuration.purpose = this._configuration.purpose ?? [];
		this.configuration.mode = this._configuration.mode ?? [];
		this.loadAddresses();

		this._respondentService.getSurveyGroupMembers(this._respondent).subscribe((respondents) => {
			for (let x of respondents) {
				this.respondents.push({
					id: x.id,
					name: x.name,
					color: colors.blue,
				});
			}
			this.users.next(this.respondents);
			this.isLoaded.next(true);
		});
		console.log(this.configuration);
		this.loadPreviousLocations();
		this.loadPriorResponseData();
	}

	public loadPreviousLocations(): void {
		this._responseService
			.listSurveyResponsesOfType(this._surveyId, QuestionResponseType.Location)
			.subscribe((x) => {
				let rValues = x.responseValues;
				// console.log(x[0]);
			});
	}

	/**
	 *
	 */
	private loadPriorResponseData(): void {
		let questionIds: SurveyViewQuestion[] = [];
		if (this.configuration.homeAllDay) {
			questionIds.push(
				<SurveyViewQuestion>this._injector.get('question.' + this.configuration.homeAllDay[0].label)
			);
		}
		if (this.configuration.homeDeparture) {
			questionIds.push(
				<SurveyViewQuestion>(
					(<SurveyViewQuestion>this._injector.get('question.' + this.configuration.homeDeparture[0].label))
				)
			);
		}
		if (this.configuration.returnHome) {
			questionIds.push(
				<SurveyViewQuestion>(
					(<SurveyViewQuestion>this._injector.get('question.' + this.configuration.returnHome[0].label))
				)
			);
		}
		this._responseService.loadSavedResponsesForRespondents(questionIds, this._respondents).subscribe((res) => {
			console.log(res);
		});
	}

	public loadAddresses(): void {
		this.addresses$ = <any>concat(
			of(['']), // default items
			this.addressInput$.pipe(
				distinctUntilChanged(),
				debounceTime(500),
				tap(() => (this.addressesLoading = true)),
				switchMap((term) =>
					this.queryAddresses(term).pipe(
						map((v) => {
							return v['features'];
						}),
						catchError(() => of([])), // empty list on error
						tap((v) => {
							this.addressesLoading = false;
						})
					)
				)
			)
		);
	}

	///geocoding/v5/{endpoint}/{search_text}.json
	private queryAddresses(input: string): Observable<Object> {
		const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${input}.json`;
		const options = {
			params: new HttpParams()
				.set(
					'access_token',
					'pk.eyJ1IjoiYnJlbmRhbmJlbnRpbmciLCJhIjoiY2s4Y3IwN3U3MG1obzNsczJjMGhoZWc4MiJ9.OCDfSypjueUF_gKejRr6Og'
				)
				.set('country', 'ca'),
		};
		return this._http.get(url, options);
	}

	public get diaryEvents(): CalendarEvent[] {
		return undefined;
	}

	/**
	 * Adds the new event data.
	 *
	 * @param {LocationResponseData} event
	 */
	public newEvent(event: TimelineResponseData & { users: User[] }): void {
		let events: CalendarEvent[] = this._diaryEvents;
		for (let u of event.users) {
			events.push({
				title: event.name,
				start: event.timeA,
				end: event.timeB,
				draggable: true,
				resizable: { afterEnd: true },
				meta: {
					purpose: event.purpose['label'],
					address: event.address['stnumber'] + ' ' + event.address['staddress'] + ' ' + event.address['city'],
					user: u,
					model: event,
					id: Date.now(),
				},
				color: colors.blue,
			});
		}
		this.diaryEvents$.next(events);
		this._diaryEvents = events;
	}

	// deletes the associated event
	public deleteEvent(event: TimelineResponseData & { id: number }): void {
		console.log('in delete');
		console.log(event);
		console.log(this);
		for (let i = 0; i < this._diaryEvents.length; i++) {
			let e = this._diaryEvents[i];
			if (e.meta.model.id === event.id) {
				console.log('deleted ');
				this._diaryEvents.splice(i, 1);
				console.log('event removed');
				break;
			}
		}
		this._diaryEvents = this._diaryEvents;
		this.diaryEvents$.next(this._diaryEvents);
	}
}
