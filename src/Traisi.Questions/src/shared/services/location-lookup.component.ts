import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { concat, Observable, of, Subject } from 'rxjs';
import { distinctUntilChanged, tap, debounceTime, switchMap, catchError, map } from 'rxjs/operators';
import { GeoServiceClient } from 'shared/geoservice-api-client.service';
import { MapLocation } from 'shared/models/map-location.model';
import templateString from './location-lookup.component.html';
import styleString from './location-lookup.component.html';

@Component({
	selector: 'traisi-location-lookup',
	template: '' + templateString,
	providers: [GeoServiceClient],
	entryComponents: [],
	styles: ['' + styleString],
})
export class LocationLookupComponent implements OnInit {
	@Output()
	public locationSelected: EventEmitter<MapLocation> = new EventEmitter(true);

	public addressResults$: Observable<any[]>;

	public addressInput$ = new Subject<string>();

	public addressesLoading: boolean = false;

	public constructor(private _geoService: GeoServiceClient) {}

	public ngOnInit(): void {
		this._initializeAddressSearch();
	}

	private _initializeAddressSearch(): void {
		this.addressResults$ = concat(
			of([]), // default items
			this.addressInput$.pipe(
				distinctUntilChanged(),
				tap(() => (this.addressesLoading = true)),
				debounceTime(500),
				switchMap((term) =>
					this._geoService.addressCompletion(term).pipe(
						catchError(() => of([])), // empty list on error
						tap((x) => {
							console.log(x);
							this.addressesLoading = false;
						}),
						map((x) => x.results)
					)
				)
			)
		);
	}
}
