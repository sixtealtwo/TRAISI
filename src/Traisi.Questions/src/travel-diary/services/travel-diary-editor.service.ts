// adds, moves etc travel diary

import { Injectable } from '@angular/core';
import { CalendarEvent } from 'calendar-utils';
import { SurveyResponseViewModel, LocationResponseData, TimelineResponseData } from 'traisi-question-sdk';
import {
	SurveyRespondentUser,
	TimelineLineResponseDisplayData,
	TravelDiaryEvent,
	colors,
} from 'travel-diary/models/consts';

// events based on user input
@Injectable()
export class TravelDiaryEditor {
	private _idCounter: number = 0;

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
	): TravelDiaryEvent[] {
		let events: TravelDiaryEvent[] = [];
		console.log(workDeparture);
		if (homeAllDay) {
			events = events.concat(this.createHomeAllDayEvent(user));
			return events;
		} else if (workDeparture || schoolDeparture) {
			let homeEvent = this.createHomeStartEvent(user);
			events.push(homeEvent);
		}

		if (returnedHome) {
			let homeEndEvent = this.createHomeEndEvent(user);
			events.push(homeEndEvent);
		}

		if (workDeparture) {
			let workEvent = this.createHomeWorkHomeEvent(user, workLocation, returnedHome);
			events.push(workEvent);
		}
		if (schoolDeparture) {
			let schoolEvent = this.createHomeSchoolHomeEvent(user, schoolLoation, returnedHome);
			events.push(schoolEvent);
		}

		return events;
	}

	public generateId(): number {
		this._idCounter++;
		return this._idCounter;
	}

	private createHomeStartEvent(user: SurveyRespondentUser): TravelDiaryEvent {
		let homeEvent = this.createBaseEvent(user, 'At Home', 'home');
		homeEvent.end = new Date(new Date().setHours(9, 0, 0, 0));
		homeEvent.meta.model.timeA = new Date(new Date().setHours(0, 0, 0, 0));
		homeEvent.meta.model.isValid = true;
		homeEvent.meta.model.address = user.homeAddress ?? {};
		return homeEvent;
	}

	private createHomeEndEvent(user: SurveyRespondentUser): TravelDiaryEvent {
		let returnHomeEvent = this.createBaseEvent(user, 'Return Home', 'home');
		returnHomeEvent.start = new Date(new Date().setHours(17, 1, 0, 0));
		returnHomeEvent.end = new Date(new Date().setHours(23, 59, 0, 0));
		returnHomeEvent.meta.model.timeA = new Date(new Date().setHours(17, 1, 0, 0));
		returnHomeEvent.meta.model.isValid = false;
		returnHomeEvent.meta.model.address = user.homeAddress ?? {};
		return returnHomeEvent;
	}

	private createHomeWorkHomeEvent(
		user: SurveyRespondentUser,
		workLocation: LocationResponseData,
		returnedHome: boolean
	): TravelDiaryEvent {
		let workEvent = this.createBaseEvent(user, 'Work (Not Home)', 'work');
		workEvent.start = new Date(new Date().setHours(9, 1, 0, 0));
		workEvent.end = new Date(new Date().setHours(17, 0, 0, 0));
		workEvent.meta.model.timeA = new Date(new Date().setHours(9, 1, 0, 0));
		workEvent.meta.model.timeB = new Date(new Date().setHours(17, 0, 0, 0));
		workEvent.meta.model.address = workLocation.address;
		return workEvent;
	}

	private createHomeSchoolHomeEvent(
		user: SurveyRespondentUser,
		schoolLocation: LocationResponseData,
		returnedHome: boolean
	): TravelDiaryEvent {
		let homeEvent = this.createBaseEvent(user, 'At Home', 'home');
		let workEvent = this.createBaseEvent(user, 'School (Not Home)', 'school');
		homeEvent.end = new Date(new Date().setHours(9, 0, 0, 0));
		workEvent.start = new Date(new Date().setHours(9, 1, 0, 0));
		workEvent.end = new Date(new Date().setHours(17, 0, 0, 0));

		workEvent.meta.model.timeA = new Date(new Date().setHours(9, 1, 0, 0));
		workEvent.meta.model.timeB = new Date(new Date().setHours(17, 0, 0, 0));
		workEvent.meta.model.address = schoolLocation.address;

		return workEvent;
	}

	/**
	 * Inserts this event into the passed list of events. It assumes the event users have already
	 * beeen split.
	 *
	 * The source events are modified in place.
	 * @param eventData
	 */
	public insertEvent(events: TravelDiaryEvent[], event: TimelineLineResponseDisplayData): TravelDiaryEvent[] {
		let displayId = this.generateId();
		console.log(event); 
		for (let u of event.users) {
			let newEvent = {
				id: displayId,
				title: event.name,
				start: event.timeA,
				// end: event.timeB,
				draggable: false,
				resizable: { afterEnd: true },
				meta: {
					purpose: event.purpose['label'],
					address: event.address,
					user: u,
					mode: event.mode['label'],
					model: event,
					id: Date.now(),
				},
				color: colors.blue,
			};
			newEvent.meta.model.displayId = displayId;
			newEvent.meta.model.isValid = true;
			events.push(newEvent);
		}
		events = events.sort((a, b) => a.meta.model.timeA - b.meta.model.timeA);
		this.reAlignTimeBoundaries(event.users, events);
		return events;
	}

	private _hasHomeStartEvent(events: TravelDiaryEvent[]): boolean {
		return true;
	}

	private _hasHomeEndEvent(events: TravelDiaryEvent[]): boolean {
		return true;
	}

	/**
	 *
	 * @param responses
	 */
	public createDiaryFromResponseData(
		respondent: SurveyRespondentUser,
		responses: TimelineResponseData[],
		events: TravelDiaryEvent[]
	) {
		for (let response of responses) {
			let event = this.createBaseEvent(respondent, response.name, response.purpose);
			event.meta.model = response;
			event.meta.model.timeA = new Date(response.timeA);
			event.meta.model.users = [respondent];
			event.meta.model.isValid = true;
			event.meta.model.displayId = this.generateId();
			events.push(event);
			if (responses.length === 1 && responses[0].purpose.toLowerCase() === 'home') {
				event.meta.homeAllDay = true;
			}
		}
	}

	/**
	 * Updates the schedule with the updated data for an event that already exists
	 * @param update
	 * @param events
	 */
	public updateEvent(update: TimelineLineResponseDisplayData, events: TravelDiaryEvent[]) {
		// find the event

		let evt = events.find((x) => x.meta.model.displayId === update.displayId);
		if (evt) {
			let newModel = Object.assign(evt.meta.model, update);

			evt.meta.model = newModel;
			evt.meta.model.isValid = true;
		} else {
		}
		this.reAlignTimeBoundaries(update.users, events);
	}

	/**
	 *
	 * @param events
	 */
	public reAlignTimeBoundaries(users: SurveyRespondentUser[], allEvents: TravelDiaryEvent[]) {
		// realigns time boundaries using the location / timeline model as master
		for (let user of users) {
			let events = allEvents.filter((x) => x.meta.user.id === user.id);
			for (let i = 0; i < events.length - 1; i++) {
				events[i].start = events[i].meta.model.timeA;
				events[i].end = events[i + 1].meta.model.timeA;
			}
			if (events.length > 2) {
				events[events.length - 1].start = events[events.length - 1].meta.model.timeA;
			}
		}
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
		let displayId = this.generateId();
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
					address: user.homeAddress,
					purpose: 'home',
					mode: undefined,
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
		let displayId = this.generateId();
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
					address: undefined,
					purpose: purpose,
					timeA: undefined,
					timeB: undefined,
					latitude: undefined,
					longitude: undefined,
					mode: undefined,
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

	/**
	 * 
	 * @param event 
	 * @param events 
	 */
	public findTravelDiaryEvent(event: TimelineLineResponseDisplayData, events: TravelDiaryEvent[]): TravelDiaryEvent {
		let match = events.find(x => x.meta.model.displayId === event.displayId)
		return match;
	}

	/**
	 * Deletes the event from the list of travel diary events
	 * @param event 
	 * @param events 
	 */
	public deleteEvent(event: TimelineLineResponseDisplayData, events: TravelDiaryEvent[]): void {
		let idx = events.findIndex(x => x.meta.model.displayId === event.displayId);
		if(idx >= 0 ) {
			events.splice(idx, 1);
		}
	}
}
