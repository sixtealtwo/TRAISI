import { Injectable } from '@angular/core'
import { CalendarEvent } from 'angular-calendar';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable()
export class TravelDiaryService {

    public diaryEvents$: BehaviorSubject<CalendarEvent>;

    public constructor() {

    }

    public get diaryEvents(): CalendarEvent[] {
        return undefined;
    }
}
