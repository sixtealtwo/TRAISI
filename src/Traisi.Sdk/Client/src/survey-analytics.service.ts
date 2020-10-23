import { Observable } from 'rxjs'

export abstract class SurveyAnalyticsService {
  public abstract sendEvent(
    eventCategory: string,
    eventAction: string,
    eventLabel?: string,
    eventValue?: string,
  ): Observable<void>
  public abstract sendTiming(
    timingCategory: string,
    timingVar: string,
    timingValue: number,
    timlingLabel?: string,
  ): Observable<void>
}
