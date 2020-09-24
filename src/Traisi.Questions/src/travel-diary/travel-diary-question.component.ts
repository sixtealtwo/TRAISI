import {
	SurveyQuestion,
	ResponseTypes,
	OnVisibilityChanged,
	LocationResponseData,
	TimelineResponseData,
	ResponseValidationState,
	ValidationError,
} from 'traisi-question-sdk';
import {
	Component,
	ViewEncapsulation,
	OnInit,
	AfterViewInit,
	ViewChild,
	ElementRef,
	TemplateRef,
	Injector,
} from '@angular/core';
import { setHours, isSameMonth, setMinutes, addHours } from 'date-fns';
import templateString from './travel-diary-question.component.html';
import styleString from './travel-diary-question.component.scss';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TravelDiaryService } from './services/travel-diary.service';
import { CalendarEvent, CalendarView, CalendarDayViewComponent } from 'angular-calendar';
import { TravelDiaryEditDialogComponent } from './components/travel-diary-edit-dialog.component';
import { DayViewSchedulerComponent } from './components/day-view-scheduler.component';
import { BehaviorSubject, Observable } from 'rxjs';
import { colors, DialogMode, TimelineLineResponseDisplayData, SurveyRespondentUser } from './models/consts';
import { TravelDiaryEditor } from './services/travel-diary-editor.service';
import { ReturnTimeValidatorDirective } from './validators/return-time.directive';
@Component({
	selector: 'traisi-travel-diary-question',
	template: '' + templateString,
	providers: [TravelDiaryService, TravelDiaryEditor, ReturnTimeValidatorDirective],
	encapsulation: ViewEncapsulation.None,
	entryComponents: [],
	styles: ['' + styleString],
})
export class TravelDiaryQuestionComponent extends SurveyQuestion<ResponseTypes.Timeline>
	implements OnInit, AfterViewInit, OnVisibilityChanged {
	public viewDate: Date = new Date();

	public viewHeight: number = 100;

	@ViewChild('schedule')
	public scheduleComponent: DayViewSchedulerComponent;

	@ViewChild('entryDialog')
	public entryDialog: TravelDiaryEditDialogComponent;

	private _isValid: boolean = false;

	public constructor(
		private _travelDiaryService: TravelDiaryService,
		private _modalService: BsModalService,
		private _elementRef: ElementRef,
		private _injector: Injector
	) {
		super();
		this.isFillVertical = true;
	}

	public get events$(): Observable<CalendarEvent[]> {
		return this._travelDiaryService.diaryEvents$;
	}

	public get events(): CalendarEvent[] {
		return this._travelDiaryService.diaryEvents;
	}

	public get users(): Observable<any> {
		return this._travelDiaryService.activeUsers;
	}

	public get isTravelDiaryValid(): boolean {
		return this._isValid;
	}

	public newEvent(): void {
		this.entryDialog.show(DialogMode.New);
	}

	public newEntrySaved(event: TimelineLineResponseDisplayData) {
		this._travelDiaryService.newEvent(event);
	}

	public eventSaved(event: TimelineLineResponseDisplayData) {
		this._travelDiaryService.updateEvent(event);
	}

	public eventDeleted(event: TimelineLineResponseDisplayData): void {
		this._travelDiaryService.deleteEvent(event);
	}

	public resetEvents(): void {
		this._travelDiaryService.resetTravelDiary();
	}

	public clearEvents(): void {
		this._travelDiaryService.clearTravelDiary();
	}

	public ngOnInit(): void {
		this._travelDiaryService.initialize();
		this._travelDiaryService.diaryEvents$.subscribe(this.eventsUpdated);
		this._travelDiaryService.activeUsers.subscribe(this.usersUpdated);
	}

	public usersUpdated = (users: SurveyRespondentUser[]): void => {};

	public eventsUpdated = (events: CalendarEvent[]): void => {
		let isValid = this._travelDiaryService.isTravelDiaryValid;
		this._isValid = isValid;
		if (isValid) {
			this.saveTravelDiary();
		}
		if (this._travelDiaryService.isLoaded.value && isValid) {
			this.validationState.emit(ResponseValidationState.VALID);
		} else {
			this.validationState.emit(ResponseValidationState.INVALID);
		}
		//if (this.scheduleComponent) {
		//	this.scheduleComponent.refresh.next();
		//	}
	};

	public saveTravelDiary(): void {
		if (this._travelDiaryService.isLoaded.value) {
			for (let r of this._travelDiaryService.respondents) {
				this.responseWithRespondent.emit({
					respondent: r,
					response: this._travelDiaryService.getTimelineResponseDataForRespondent(r),
				});
			}
		}
	}

	public eventClicked({ event }: { event: CalendarEvent }): void {
		this.entryDialog.show(DialogMode.Edit, event.meta.model);
	}

	public ngAfterViewInit(): void {}
	public onQuestionShown(): void {}
	public onQuestionHidden(): void {}

	public traisiOnInit(): void {}

	public get isComponentLoaded(): BehaviorSubject<boolean> {
		return this._travelDiaryService.isLoaded;
	}

	public reportErrors(): ValidationError[] {
		return this._travelDiaryService.reportErrors();
	}
}
