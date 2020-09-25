import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import * as introJs from 'intro.js';

@Injectable()
export class TravelDiaryTourService {
	private _tour = introJs();
	public constructor(@Inject(DOCUMENT) private _document: Document) {
		console.log(this._document);
	}

	public initialize(): void {

        let events = document.querySelectorAll('.cal-event-container');
        let lastEvent = events[events.length-1];

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
                            <p>The day begins at 4am, and ends the next day at 3:59AM. Each trip in the summary is displayed in the order they occur throughout the day.</p>`
                },
                {
					element: lastEvent,
                    intro: `<h3>Travel Diary - Don't miss</h3>
                            <p>The timeline scrolls too - make sure you don't miss the last event of the day when filling in your information.</p>`,
				},
			],
		});
	}

	public startTour(): void {
		console.log('starting tour');
		this._tour.start();
		console.log(this._tour);
	}
}
