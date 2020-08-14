import { SurveyQuestion, ResponseTypes, OnVisibilityChanged } from 'traisi-question-sdk';
import { Component, ViewEncapsulation, OnInit, AfterViewInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { setHours, isSameMonth, setMinutes, addHours } from 'date-fns';
import templateString from './travel-diary-question.component.html';
import styleString from './travel-diary-question.component.scss';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TravelDiaryService } from './travel-diary.service';
import { CalendarEvent, CalendarView, CalendarDayViewComponent } from 'angular-calendar';
import { TravelDiaryEditDialogComponent } from './travel-diary-edit-dialog.component';

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

	events: CalendarEvent[] = [
		{
			title: 'Home',
			start: setHours(setMinutes(new Date(), 0), 3),
			end: setHours(setMinutes(new Date(), 0), 8),
			color: {
				primary: '#1e90ff',
				secondary: '#D1E8FF',
			},
		},
		{
			title: 'Home',
			start: setHours(setMinutes(new Date(), 0), 17),
			end: setHours(setMinutes(new Date(), 0), 24),
			color: {
				primary: '#1e90ff',
				secondary: '#D1E8FF',
			},
		},
	];

	public newEvent(): void {
		this.entryDialog.show();
	}

	public ngOnInit(): void {
		console.log(this._elementRef);
		console.log(this._elementRef.nativeElement.parentNode);
		this.viewHeight = this._elementRef.nativeElement.parentNode.offsetHeight - 100;
		console.log(this.viewHeight);
	}
	public ngAfterViewInit(): void {}
	public onQuestionShown(): void {
		// called when the question is visible again
		console.log(this._elementRef);
		console.log(this._elementRef.nativeElement.parentNode);
	}
	public onQuestionHidden(): void {}
}
