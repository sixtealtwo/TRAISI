import { SurveyQuestion, ResponseTypes, OnVisibilityChanged, LocationResponseData } from 'traisi-question-sdk';
import { Component, ViewEncapsulation, OnInit, AfterViewInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { setHours, isSameMonth, setMinutes, addHours } from 'date-fns';
import templateString from './travel-diary-question.component.html';
import styleString from './travel-diary-question.component.scss';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TravelDiaryService, colors } from './travel-diary.service';
import { CalendarEvent, CalendarView, CalendarDayViewComponent } from 'angular-calendar';
import { TravelDiaryEditDialogComponent } from './travel-diary-edit-dialog.component';
import { User } from './day-view-scheduler.component';
import { BehaviorSubject } from 'rxjs';
@Component({
	selector: 'traisi-travel-diary-question',
	template: '' + templateString,
	providers: [TravelDiaryService],
	encapsulation: ViewEncapsulation.None,
	entryComponents: [],
	styles: ['' + styleString],
})
export class TravelDiaryQuestionComponent extends SurveyQuestion<ResponseTypes.Location>
	implements OnInit, AfterViewInit, OnVisibilityChanged {
	public viewDate: Date = new Date();

	public viewHeight: number = 100;

	@ViewChild('schedule')
	public scheduleComponent: CalendarDayViewComponent;

	@ViewChild('entryDialog')
	public entryDialog: TravelDiaryEditDialogComponent;

	public constructor(
		private _travelDiaryService: TravelDiaryService,
		private _modalService: BsModalService,
		private _elementRef: ElementRef
	) {
		super();
	}

	events: CalendarEvent[] = [];

	public get users(): any[] {
		return this._travelDiaryService.respondents;
	}

	public newEvent(): void {
		this.entryDialog.show();
	}

	public entrySaved(event: LocationResponseData | { users: User[] }) {
		console.log('saved');
		console.log(event);
	}

	public ngOnInit(): void {
		console.log(this);
		// initialize service with configuration
		this._travelDiaryService.initialize(this.respondent, this.configuration, this.surveyId);
	}
	public ngAfterViewInit(): void {}
	public onQuestionShown(): void {}
	public onQuestionHidden(): void {}

	public traisiOnInit(): void {
		console.log('in on init ');
	}

	public get isComponentLoaded(): BehaviorSubject<boolean> {
		return this._travelDiaryService.isLoaded;
	}
}
