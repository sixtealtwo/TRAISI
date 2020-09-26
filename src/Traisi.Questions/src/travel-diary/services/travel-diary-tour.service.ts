import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import * as introJs from 'intro.js';
import { BsDropdownDirective } from 'ngx-bootstrap/dropdown';
import { PopoverDirective } from 'ngx-bootstrap/popover';

@Injectable()
export class TravelDiaryTourService {
	private _tour = introJs();
	private _popover: BsDropdownDirective;
	private _lastEvent;
	public constructor(@Inject(DOCUMENT) private _document: Document) {
		console.log(this._document);
	}

	public initialize(popover: BsDropdownDirective): void {
		this._popover = popover;
		let events = document.querySelectorAll('.cal-event-container');
		this._lastEvent = events[events.length - 1];
		this._tour.onbeforechange(this.onBeforeChange);
		this._tour.setOptions({
			steps: [
				{
					intro: `<h3>Travel Diary</h3>
                            <p>This question will collect trip information for you and members of your household.<p>
                            <p>Press next to see instructions on how to enter information about the trips you took on the assigned travel date. If
                            you need to see the instructions again, click the help icon at the bottom of the page.</p>`,
				},
				{
					element: this._document.querySelector('#travelDiaryQuestionContainer'),
					intro: `<h3>Travel Diary - Overview</h3>
                            <p>The highlighted area shows an overview of all the trips entered for the assigned travel date.</p>
                            <p>The day begins at 4am, and ends the next day at 3:59AM. Each trip in the summary is displayed in the order they occur throughout the day.</p>
                            `,
				},
				{
					element: this._document.querySelector('.add-event-button'),
					intro: `<h3>Travel Diary - Add a Trip</h3>
                            <p>Click this button to add new trips to your travel diary. If you wish to edit an existing activity or trip, simply click it in the summary.</p>
                            <p>Trips with a dashed orange border means that the trip is missing some information.</p>`,
				},
				{
					element: this._lastEvent,
					intro: `<h3>Travel Diary - Don't miss any information</h3>
                            <p>The timeline scrolls too - make sure you don't miss the last event of the day when filling in your information.</p>`,
				},
			],
		});
	}

	public startTour(): void {
		this._popover.toggle(true);
		this._tour.start();
	}

	public onBeforeChange = () => {
		if (this._tour._currentStep === 3) {
			this._popover.show();
			// this._popover.toggle(true);
			this._lastEvent.scrollIntoView();
		}
	};
}
