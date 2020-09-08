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
		if (homeAllDay) {
			events = events.concat(this.createHomeAllDayEvent(user));
			return events;
		} else if (workDeparture || schoolDeparture || returnedHome) {
			let homeEvent = this.createHomeStartEvent(user);
			events.push(homeEvent);
		}

		if (returnedHome) {
			let homeEndEvent = this.createHomeEndEvent(user);
			events.push(homeEndEvent);
		}

		if (workDeparture) {
			let workEvent = this.createHomeWorkHomeEvent(user, workLocation, returnedHome, schoolDeparture);
			events.push(workEvent);
		}
		if (schoolDeparture) {
			let schoolEvent = this.createHomeSchoolHomeEvent(user, schoolLoation, returnedHome, workDeparture);
			events.push(schoolEvent);
		}

		this.resetOrders(events);
		return events;
	}

	public resetOrders(event: TravelDiaryEvent[]): void {
		for (let i = 0; i < event.length; i++) {
			event[i].meta.model.order = i;
		}
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
		homeEvent.meta.model.order = 0;
		homeEvent.meta.model.address = user.homeAddress ?? {};
		homeEvent.meta.model.latitude = user.homeLatitude;
		homeEvent.meta.model.longitude = user.homeLongitude;
		console.log(user);
		return homeEvent;
	}

	private createHomeEndEvent(user: SurveyRespondentUser): TravelDiaryEvent {
		let returnHomeEvent = this.createBaseEvent(user, 'Return Home', 'home');
		returnHomeEvent.start = new Date(new Date().setHours(17, 1, 0, 0));
		returnHomeEvent.end = new Date(new Date().setHours(23, 59, 0, 0));
		returnHomeEvent.meta.model.timeA = new Date(new Date().setHours(17, 1, 0, 0));
		returnHomeEvent.meta.model.isValid = false;
		returnHomeEvent.meta.model.model = 2;
		returnHomeEvent.meta.model.address = user.homeAddress ?? {};
		returnHomeEvent.meta.model.latitude = user.homeLatitude;
		returnHomeEvent.meta.model.longitude = user.homeLongitude;
		return returnHomeEvent;
	}

	private createHomeWorkHomeEvent(
		user: SurveyRespondentUser,
		workLocation: LocationResponseData,
		returnedHome: boolean,
		hasSchoolTrip: boolean
	): TravelDiaryEvent {
		let workEvent = this.createBaseEvent(user, 'Work (Not Home)', 'work');
		workEvent.start = new Date(new Date().setHours(9, 1, 0, 0));
		workEvent.end = new Date(new Date().setHours(hasSchoolTrip ? 12 : 17, 0, 0, 0));
		workEvent.meta.model.timeA = new Date(new Date().setHours(9, 1, 0, 0));
		workEvent.meta.model.timeB = new Date(new Date().setHours(hasSchoolTrip ? 12 : 17, 0, 0, 0));
		workEvent.meta.model.address = workLocation.address;
		workEvent.meta.model.latitude = workLocation.latitude;
		workEvent.meta.model.longitude = workLocation.longitude;
		workEvent.meta.model.order = 1;
		return workEvent;
	}

	private createHomeSchoolHomeEvent(
		user: SurveyRespondentUser,
		schoolLocation: LocationResponseData,
		returnedHome: boolean,
		hasWorkTrip: boolean
	): TravelDiaryEvent {
		let homeEvent = this.createBaseEvent(user, 'At Home', 'home');
		let workEvent = this.createBaseEvent(user, 'School (Not Home)', 'school');
		homeEvent.end = new Date(new Date().setHours(9, 0, 0, 0));
		workEvent.start = new Date(new Date().setHours(hasWorkTrip ? 12 : 9, 1, 0, 1));
		workEvent.end = new Date(new Date().setHours(17, 0, 0, 0));

		workEvent.meta.model.timeA = new Date(new Date().setHours(hasWorkTrip ? 12 : 9, 1, 0, 1));
		workEvent.meta.model.timeB = new Date(new Date().setHours(17, 0, 0, 0));
		workEvent.meta.model.address = schoolLocation.address;
		workEvent.meta.model.latitude = schoolLocation.latitude;
		workEvent.meta.model.longitude = schoolLocation.longitude;
		workEvent.meta.model.order = 1;

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
		event.displayId = displayId;
		for (let u of event.users) {
			if (!event.isInserted) {
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
						id: displayId,
					},
					color: colors.blue,
				};
				newEvent.meta.model.displayId = displayId;
				newEvent.meta.model.isValid = true;
				events.push(newEvent);
			} else {
				// need to insert this event, but then find overalpping event
				let overlap = this.getOverlappingDeparture(event, events);
				if (overlap) {
					// set the overlap END to the start of this event
					overlap.end = event.timeA;
					// create a new event that
					let insertedEvent = {
						id: displayId,
						title: event.name,
						start: event.timeA,
						end: event.insertedEndTime,
						draggable: false,
						resizable: { afterEnd: true },
						meta: {
							purpose: event.purpose['label'],
							address: event.address,
							user: u,
							mode: event.mode['label'],
							model: event,
							id: displayId,
						},
						color: colors.blue,
					};
					displayId = this.generateId();
					let returnEvent = {
						id: displayId,
						title: overlap.title,
						start: event.insertedEndTime,
						end: overlap.end,
						draggable: false,
						resizable: { afterEnd: true },
						meta: {
							purpose: overlap.meta.purpose,
							address: overlap.meta.address,
							user: overlap.meta.user,
							mode: overlap.meta.mode,
							model: Object.assign({}, overlap.meta.model),
							id: displayId,
						},
						color: colors.blue,
					};
					returnEvent.meta.model.displayId = displayId;
					returnEvent.meta.model.timeA = event.insertedEndTime;
					returnEvent.meta.model.isValid = true;
					insertedEvent.meta.model.isValid = true;
					events.push(insertedEvent);
					events.push(returnEvent);
				}
			}
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
	 * @param model
	 * @param events
	 */
	public getOverlappingDeparture(
		model: TimelineLineResponseDisplayData,
		events: TravelDiaryEvent[]
	): TravelDiaryEvent {
		if (!model.users) {
			return undefined;
		}
		for (let respondent of model.users) {
			// get users for event
			let userEvents = events.filter((x) => x.meta.user.id === respondent.id);
			for (let i = 1; i < userEvents.length; i++) {
				if (userEvents[i].start < model.timeA && userEvents[i].end > model.timeA) {
					return userEvents[i];
				}
			}
		}
		return undefined;
	}

	/**
	 *
	 * @param model
	 * @param events
	 */
	public getLaterEvent(model: TimelineLineResponseDisplayData, events: TravelDiaryEvent[]): TravelDiaryEvent {
		if (!model.users) {
			return undefined;
		}
		for (let respondent of model.users) {
			// get users for event
			let userEvents = events.filter((x) => x.meta.user.id === respondent.id);
			for (let i = 1; i < userEvents.length - 1; i++) {
				if (userEvents[i].start >= model.timeA && model.displayId !== userEvents[i].meta.model.displayId) {
					return userEvents[i];
				}
			}
		}
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
			evt.start = update.timeA;
			if (update.hasEndTime) {
				evt.end = update.insertedEndTime;
			}
		} else {
		}
		this.reAlignTimeBoundaries(update.users, events, update);
	}

	/**
	 *
	 * @param events
	 */
	public reAlignTimeBoundaries(
		users: SurveyRespondentUser[],
		allEvents: TravelDiaryEvent[],
		updated: TimelineLineResponseDisplayData = null
	) {
		// realigns time boundaries using the location / timeline model as master
		for (let user of users) {
			let events = allEvents.filter((x) => x.meta.user.id === user.id);
			events = events.sort((a, b) => a.meta.model.timeA - b.meta.model.timeA);
			for (let i = 0; i < events.length - 1; i++) {
				events[i].meta.model.order = i;
				events[i].start = events[i].meta.model.timeA;
				if (events[i].meta.model.displayId === updated?.displayId && updated?.hasEndTime) {
					events[i + 1].start = events[i].meta.model.insertedEndTime;
					if (events[i].meta.model.insertedEndTime) {
						events[i + 1].meta.model.timeA = events[i].meta.model.insertedEndTime;
					}
					events[i].end = events[i].meta.model.insertedEndTime;
				} else {
					events[i].end = events[i + 1].meta.model.timeA;
				}
			}
			if (events.length > 1) {
				events[events.length - 1].meta.model.order = events.length - 1;
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
					displayAddress: null,
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
		let match = events.find((x) => x.meta.model.displayId === event.displayId);
		return match;
	}

	/**
	 * Deletes the event from the list of travel diary events
	 * @param event
	 * @param events
	 */
	public deleteEvent(event: TimelineLineResponseDisplayData, events: TravelDiaryEvent[]): void {
		let idx = events.findIndex((x) => x.meta.model.displayId === event.displayId);
		if (idx >= 0) {
			events.splice(idx, 1);
		}
		this.reAlignTimeBoundaries(event.users, events);
	}

	public updateIndices(user: SurveyRespondentUser, events: TravelDiaryEvent[]): void {
		let userEvents = events.filter((x) => x.meta.user.id === user.id);
		for (let i = 0; i < userEvents.length; i++) {
			userEvents[i].meta.model.order = i;
		}
	}
}
