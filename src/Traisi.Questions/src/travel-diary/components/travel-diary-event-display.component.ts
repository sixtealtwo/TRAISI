import { Component, ViewEncapsulation, OnChanges, SimpleChanges, OnInit, Input } from '@angular/core';
import { CalendarWeekViewComponent, CalendarEvent } from 'angular-calendar';
import templateString from './travel-diary-event-display.component.html';
import styleString from './travel-diary-event-display.component.scss';
@Component({
	// tslint:disable-line max-classes-per-file
	selector: 'traisi-travel-diary-event-display',
	template: '' + templateString,
	encapsulation: ViewEncapsulation.None,
	styles: ['' + styleString],
	providers: [],
})
export class TravelDiaryEventDisplayComponent implements OnInit {
	@Input() public timeEvent: CalendarEvent;

	public ngOnInit(): void {
        console.log(this.timeEvent);
    }
}
