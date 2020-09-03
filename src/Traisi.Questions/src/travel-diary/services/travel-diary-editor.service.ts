// adds, moves etc travel diary

import { Injectable } from '@angular/core';
import { CalendarEvent } from 'calendar-utils';
import { SurveyResponseViewModel, LocationResponseData } from 'traisi-question-sdk';
import {
	SurveyRespondentUser,
	TimelineLineResponseDisplayData,
	TravelDiaryEvent,
	colors,
} from 'travel-diary/models/consts';

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
		user: SurveyRespondentUser,
		homeAllDay: boolean,
		workDeparture: boolean,
		schoolDeparture: boolean,
		returnedHome: boolean,
		workLocation?: any,
		schoolLoation?: any
	): CalendarEvent[] {
		let events: CalendarEvent[] = [];
		console.log('in create event');
		if (homeAllDay) {
			events = events.concat(this.createHomeAllDayEvent(user));
		}
		if (workDeparture) {
			events = events.concat(this.createHomeWorkHomeEvent(user, workLocation));
		}
		if (schoolDeparture) {
			events = events.concat(this.createHomeSchoolHomeEvent(user, schoolLoation));
		}

		return events;
	}

	private createHomeWorkHomeEvent(
		user: SurveyRespondentUser,
		workLocation: LocationResponseData
	): TravelDiaryEvent[] {
		console.log('creating home work home');

		let homeEvent = this.createBaseEvent(user, 'At Home', 'home');
		let workEvent = this.createBaseEvent(user, 'Work (Not Home)', 'work');
		let returnHomeEvent = this.createBaseEvent(user, 'Return Home', 'home');
		homeEvent.end = new Date(new Date().setHours(9, 0, 0, 0));
		workEvent.start = new Date(new Date().setHours(9, 1, 0, 0));
		workEvent.end = new Date(new Date().setHours(17, 0, 0, 0));

		workEvent.meta.model.timeA = new Date(new Date().setHours(9, 1, 0, 0));
		workEvent.meta.model.timeB = new Date(new Date().setHours(17, 0, 0, 0));

		returnHomeEvent.start = new Date(new Date().setHours(17, 1, 0, 0));
		returnHomeEvent.end = new Date(new Date().setHours(23, 59, 0, 0));

		return [homeEvent, workEvent, returnHomeEvent];
	}

	private createHomeSchoolHomeEvent(
		user: SurveyRespondentUser,
		schoolLocation: LocationResponseData
	): TravelDiaryEvent[] {
		console.log('creating home work home');

		let homeEvent = this.createBaseEvent(user, 'At Home', 'home');
		let workEvent = this.createBaseEvent(user, 'School (Not Home)', 'school');
		let returnHomeEvent = this.createBaseEvent(user, 'Return Home', 'home');
		homeEvent.end = new Date(new Date().setHours(9, 0, 0, 0));
		workEvent.start = new Date(new Date().setHours(9, 1, 0, 0));
		workEvent.end = new Date(new Date().setHours(17, 0, 0, 0));

		workEvent.meta.model.timeA = new Date(new Date().setHours(9, 1, 0, 0));
		workEvent.meta.model.timeB = new Date(new Date().setHours(17, 0, 0, 0));

		returnHomeEvent.start = new Date(new Date().setHours(17, 1, 0, 0));
		returnHomeEvent.end = new Date(new Date().setHours(23, 59, 0, 0));

		return [homeEvent, workEvent, returnHomeEvent];
	}

	/**
	 * Inserts this event into the passed list of events. It assumes the event users have already
	 * beeen split.
	 *
	 * The source events are modified in place.
	 * @param eventData
	 */
	public insertEvent(events: CalendarEvent[], event: TimelineLineResponseDisplayData): void {
		let displayId = Date.now();
		for (let u of event.users) {
			let newEvent = {
				id: displayId,
				title: event.name,
				start: event.timeA,
				end: event.timeB,
				draggable: false,
				resizable: { afterEnd: true },
				meta: {
					purpose: event.purpose['label'],
					address: event.address['stnumber'] + ' ' + event.address['staddress'] + ' ' + event.address['city'],
					user: u,
					mode: event.mode['label'],
					model: event,
					id: Date.now(),
				},
				color: colors.blue,
			};
			newEvent.meta.model.displayId = displayId;
			newEvent.meta.model.isValid = true;
		}
		console.log(' inserting an event ');
	}

	private _hasHomeStartEvent(events: TravelDiaryEvent[]): boolean {
		return true;
	}

	private _hasHomeEndEvent(events: TravelDiaryEvent[]): boolean {
		return true;
	}

	/**
	 * Updates the schedule with the updated data for an event that already exists
	 * @param update
	 * @param events
	 */
	public updateEvent(update: TimelineLineResponseDisplayData, events: TravelDiaryEvent[]) {
		// find the event
		let evt = events.find((x) => x.id === update.displayId);
		if (evt) {
			Object.assign(evt.meta.model, update);
		}
		console.log(evt);
	}

	/**
	 * Appends a new event to the list of events
	 * @param newEvent
	 * @param events
	 * @param param2
	 */
	public appendEvent(newEvent: TravelDiaryEvent, events: TravelDiaryEvent[]): void {}

	/**
	 * Creates an at home all day event
	 * @param user
	 */
	private createHomeAllDayEvent(user: SurveyRespondentUser): TravelDiaryEvent[] {
		let displayId = Date.now();
		let events: TravelDiaryEvent[] = [];
		events.push({
			id: displayId,
			title: 'Home All Day',
			draggable: false,
			resizable: {
				beforeStart: false,
				afterEnd: false,
			},
			meta: {
				purpose: 'home',
				homeAllDay: true,
				address: undefined,
				user: user,
				mode: undefined,
				model: {
					address: '',
					purpose: 'home',
					timeA: new Date(new Date().setHours(0, 0, 0, 0)),
					timeB: new Date(new Date().setHours(23, 59, 0, 0)),
					latitude: undefined,
					longitude: undefined,
					name: 'Home All Day',
					order: 0,
					users: [user],
					id: undefined,
					displayId: displayId,
					isValid: true,
				},
				id: Date.now(),
			},
			start: new Date(new Date().setHours(0, 0, 0, 0)),
			end: new Date(new Date().setHours(23, 59, 0, 0)),
		});
		return events;
	}

	/**
	 *
	 * @param user
	 * @param title
	 * @param purpose
	 */
	private createBaseEvent(user: SurveyRespondentUser, title: string, purpose: string): TravelDiaryEvent {
		let displayId = Date.now();
		return {
			id: displayId,
			title: title,
			draggable: false,
			resizable: {
				beforeStart: false,
				afterEnd: false,
			},
			meta: {
				purpose: purpose,
				homeAllDay: false,
				address: undefined,
				user: user,
				mode: undefined,
				model: {
					address: '',
					purpose: purpose,
					timeA: undefined,
					timeB: undefined,
					latitude: undefined,
					longitude: undefined,
					name: title,
					order: 0,
					users: [user],
					id: undefined,
					displayId: displayId,
					isValid: false,
				},
				id: Date.now(),
			},
			start: new Date(new Date().setHours(0, 0, 0, 0)),
			end: new Date(new Date().setHours(23, 59, 0, 0)),
		};
	}
}
