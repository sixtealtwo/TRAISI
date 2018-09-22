import { Observable } from 'rxjs';

export interface SurveyResponder {
	saveStringResponse(data: string): Observable<any>;
	saveBooleanResponse(data: boolean): Observable<any>;
	saveIntegerResponse(data: number): Observable<any>;
	saveDecimalResponse(data: number): Observable<any>;
	saveLocationResponse(data: string): Observable<any>;
	saveJsonResponse(data: object): Observable<any>;
	saveOptionListResponse(data: any[]): Observable<any>;
	saveDateTimeResponse(data: Date): Observable<any>;
}

/*
        String,
        Boolean,
        Integer,
        Decimal,
        Location,
        Json,
        OptionList,
        DateTime
 */
