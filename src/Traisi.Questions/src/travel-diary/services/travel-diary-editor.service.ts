// adds, moves etc travel diary

import { Injectable } from '@angular/core';
import { CalendarEvent } from 'calendar-utils';
import { SurveyResponseViewModel } from 'traisi-question-sdk';
import { User } from 'travel-diary/components/day-view-scheduler.component';

// events based on user input
@Injectable()
export class TravelDiaryEditor {
	public constructor() {}

	/**
	 * Will attempt to create, if  any, the appropriate initial events on the travel diary
	 * for this user.
	 * @param respondent
	 */
	public createDefaultTravelDiaryforRespondent(
		user: User,
		homeAllDay: boolean,
		homeDeparture: boolean,
		returnedHome: boolean
	): CalendarEvent[] {
		let events: CalendarEvent[] = [];

		console.log('in creating default event'); 
		if (homeAllDay) {
			events.push({
				title: 'Home All Day',
				draggable: false,
				resizable: {
					beforeStart: false,
					afterEnd: false,
				},
				meta: {
					purpose: 'home',
					address: '1234 Memory Lane',
					user: user,
					mode: null,
					model: {},
					id: Date.now(),
				},
				start: new Date(new Date().setHours(0, 0, 0, 0)),
				end: new Date(new Date().setHours(23, 0, 0, 0)),
			});
		}

		return events;
	}
}
