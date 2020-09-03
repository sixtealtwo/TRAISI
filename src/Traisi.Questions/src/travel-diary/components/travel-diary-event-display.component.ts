import { Component, ViewEncapsulation, OnChanges, SimpleChanges, OnInit, Input, HostBinding } from '@angular/core';
import { CalendarWeekViewComponent, CalendarEvent } from 'angular-calendar';
import templateString from './travel-diary-event-display.component.html';
import styleString from './travel-diary-event-display.component.scss';
import { TravelDiaryEvent, TravelDiaryViewTimeEvent } from 'travel-diary/models/consts';
@Component({
	// tslint:disable-line max-classes-per-file
	selector: 'traisi-travel-diary-event-display',
	template: '' + templateString,
	styles: ['' + styleString],
	providers: [],
})

export class TravelDiaryEventDisplayComponent implements OnInit {
	@Input() public timeEvent: TravelDiaryViewTimeEvent;

	@HostBinding('class') public class = '';

	public ngOnInit(): void {
		if (this.timeEvent.event.meta.homeAllDay) {
			this.class = 'event-home-all-day';
		}
	}
}
