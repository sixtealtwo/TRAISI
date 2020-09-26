import {
	SurveyQuestion,
	ResponseTypes,
	OnVisibilityChanged,
	LocationResponseData,
	TimelineResponseData,
	ResponseValidationState,
	ValidationError,
	SurveyRespondent,
	TraisiValues,
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
	Inject,
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
import {
	colors,
	DialogMode,
	TimelineLineResponseDisplayData,
	SurveyRespondentUser,
	TravelDiaryEvent,
} from './models/consts';
import { TravelDiaryEditor } from './services/travel-diary-editor.service';
import { ReturnTimeValidatorDirective } from './validators/return-time.directive';
import { TravelDiaryTourService } from './services/travel-diary-tour.service';
import { PopoverDirective } from 'ngx-bootstrap/popover';
import { BsDropdownDirective } from 'ngx-bootstrap/dropdown';
// import { tour } from './tour/travel-diary-tour';
@Component({
	selector: 'traisi-travel-diary-question',
	template: '' + templateString,
	providers: [TravelDiaryService, TravelDiaryEditor, ReturnTimeValidatorDirective, TravelDiaryTourService],
	encapsulation: ViewEncapsulation.None,
	entryComponents: [],
	styles: ['' + styleString],
})
export class TravelDiaryQuestionComponent extends SurveyQuestion<ResponseTypes.Timeline>
	implements OnInit, AfterViewInit, OnVisibilityChanged {
	public viewHeight: number = 100;

	@ViewChild('schedule')
	public scheduleComponent: DayViewSchedulerComponent;

	@ViewChild('entryDialog')
	public entryDialog: TravelDiaryEditDialogComponent;

	@ViewChild('dropdownToggle')
	public dropdownToggle: BsDropdownDirective;

	@ViewChild('template', { read: TemplateRef })
	public template: TemplateRef<any>;

	private _isValid: boolean = false;

	public modalRef: BsModalRef | null;

	public constructor(
		private _travelDiaryService: TravelDiaryService,
		private _modalService: BsModalService,
		private _elementRef: ElementRef,
		private _injector: Injector,
		private _tour: TravelDiaryTourService,
		private modalService: BsModalService,
		@Inject(TraisiValues.Respondent) private _respondent: SurveyRespondent,
		@Inject(TraisiValues.PrimaryRespondent) private _primaryRespondent: SurveyRespondent
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

	public get viewDate(): Date {
		return this._travelDiaryService.viewDate;
	}

	public newEvent(): void {
		this.entryDialog.show(DialogMode.New);
	}

	public newEntrySaved(event: TimelineLineResponseDisplayData) {
		if (event.isReturnHomeSplit) {
			this.openModal(this.template);
		}
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
		this._travelDiaryService.inactiveDiaryEvents$.subscribe(this.inactiveEventsUpdated);

		this._travelDiaryService.isLoaded.subscribe((v) => {
			if (v && this._respondent.id === this._primaryRespondent.id) {
				console.log(this);
				this.startTour();
			}
		});
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
	};

	/**
	 *
	 * @param events
	 */
	public inactiveEventsUpdated = (events: TravelDiaryEvent[]): void => {
		console.log('got inactive events update');
		console.log(events);
		if (events.length > 0) {
			let respondent = events[0].meta.model.users[0];
			this.saveInactiveTravelDiary(respondent);
		}
	};

	/**
	 * Saves the travel diary for all active respondents
	 */
	public saveTravelDiary(): void {
		if (this._travelDiaryService.isLoaded.value) {
			for (let r of this._travelDiaryService.activeRespondents) {
				this.responseWithRespondent.emit({
					respondent: r,
					response: this._travelDiaryService.getTimelineResponseDataForRespondent(r),
				});
			}
		}
	}

	/**
	 * Saves the inactive
	 * @param respondent
	 */
	public saveInactiveTravelDiary(respondent: SurveyRespondentUser): void {
		if (this._travelDiaryService.isLoaded.value) {
			let response = this._travelDiaryService.getTimelineResponseDataForRespondent(respondent);
			this.responseWithRespondent.emit({
				respondent: respondent,
				response: response,
			});
		}
	}

	public eventClicked({ event }: { event: CalendarEvent }): void {
		this.entryDialog.show(DialogMode.Edit, event.meta.model);
	}

	public startTour(): void {
		this._tour.initialize(this.dropdownToggle);
		this._tour.startTour();
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

	public openModal(template: TemplateRef<any>): void {
		this.modalRef = this.modalService.show(template, { class: 'modal-dialog-centered' });
	}
}
