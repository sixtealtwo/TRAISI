import {
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	ElementRef,
	Inject,
	OnInit,
	ViewChild,
	ViewEncapsulation,
} from '@angular/core';
import {
	OnVisibilityChanged,
	ResponseTypes,
	ResponseValidationState,
	SurveyQuestion,
	SurveyViewer,
	ResponseData,
	JsonResponseData,
	StringResponseData,
	TraisiValues
} from 'traisi-question-sdk';
import templateString from './kml-file-question.component.html';
import styleString from './kml-file-question.component.scss';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { debounceTime, skip } from 'rxjs/operators';
import { KMLFileQuestionConfiguration } from './kml-file-question.configuration';
import { Tracing } from 'trace_events';
import * as mapboxgl from 'mapbox-gl';
import { parse } from 'path';

@Component({
	selector: 'traisi-kml-file-question',
	template: '' + templateString,
	styles: ['' + styleString],
})
export class KMLFileQuestionComponent
	extends SurveyQuestion<ResponseTypes.String>
	implements OnInit {

	/**
	 * Purpose  of map question component
	 */
	public purpose: string = '';
	public preferredHeight = 350;

	public onInit: () => void;

	fileName = '';
	uploadURL = "";

	private readonly _UploadUrl: string = '/api/Upload';
	private readonly _deleteUploadedUrl: string = '/api/Upload/delete';

	@ViewChild('kmlFileUpload', { static: true })
	private fileInputElement: HTMLInputElement;

	@ViewChild('f', { static: true })
	public inputForm: NgForm;

	public model = {};

	public kmlInput: string;
	public validatedKMLInput: string;
	KMLFileValid: boolean = true;
	KMLFileLoaded: boolean = false;

	KMLEventArray = new Array();
	KMLLocationsArray = new Array();

	KMLValidationSelected = new Array();

	KMLWarningString: string = "";

	kmlDate: string = "2023-01-18";

	KMLTimezoneAdjust = -4;

	@ViewChild('mapElement') mapElement: ElementRef;

	KMLPointsCoordArray = new Array();

	PointsGeoJson = {
		'type': 'FeatureCollection',
		'features': []
	};

	LinesGeoJson = {
		'type': 'FeatureCollection',
		'features': []
	};

	/**
	 *
	 * @param surveyViewerService
	 */
	constructor(
		@Inject('SurveyViewerService') private surveyViewerService: SurveyViewer,
		@Inject(TraisiValues.Configuration) public configuration: KMLFileQuestionConfiguration,
		private http: HttpClient
	) {
		super();
		this.uploadURL = "";
	}

	/**
	 * on init
	 */
	public ngOnInit(): void {
		this.savedResponse.subscribe(this.onSavedResponseData);

		let configDate = this.configuration.date.toString();
		this.kmlDate = configDate.slice(0, 4) + "-" + configDate.slice(4, 6) + "-" + configDate.slice(6, 8);
		//this.kmlDate = configDate;
	}

	public traisiOnInit(): void { }

	// private onSavedResponseData(): void {}

	private onSavedResponseData: (response: ResponseData<ResponseTypes.String>[]) => void = (
		response: ResponseData<ResponseTypes.String>[]
	) => {
		console.log("Response: ");
		console.log(response);

		if (response.length > 0) {
			let stringResponse = <StringResponseData>response[0];
			this.kmlInput = stringResponse.value;

			this.ReadKMLString();
			this.LoadValidationFromKML();
			this.onValidateSelect("ev");

			if (this.isInputValid(this.validatedKMLInput)) {
				console.log("valid state");
				this.validationState.emit(ResponseValidationState.VALID);
			}
		}

		this.inputForm.valueChanges.pipe(debounceTime(1000), skip(1)).subscribe((value) => {
			if (this.validatedKMLInput === undefined) {
				return;
			}
			if (!this.isInputValid(this.validatedKMLInput)) {
				this.validationState.emit(ResponseValidationState.INVALID);
			} else {
				let data: StringResponseData = {
					value: this.validatedKMLInput,
				};

				this.response.emit([data]);

				console.log(this.validatedKMLInput);
			}
		});
	};

	/**
	 *
	 * @param stringInput
	 */
	private isInputValid(stringInput: string): boolean {
		if (stringInput) {
			return true;
		} else {
			return false;
		}
	}

	private onValidateSelect(event) {
		console.log(this.KMLValidationSelected);
		// console.log(this.KMLValidationSelected.length);
		// console.log(this.KMLEventArray.length);
		// console.log(this.kmlInput.split("<Placemark>").length);

		if (!this.KMLValidationSelected.includes(undefined)
			&& !this.KMLValidationSelected.includes("blank")
			&& this.KMLValidationSelected.length != 0
			&& this.KMLValidationSelected.length == this.KMLEventArray.length) {
			let splitKMLInput = this.kmlInput.split("</address>");
			this.validatedKMLInput = "";

			for (let i = 0; i < splitKMLInput.length - 1; i++) {
				this.validatedKMLInput += splitKMLInput[i] + "</address><Validation>" + this.KMLValidationSelected[i] + "</Validation>";
			}
			this.validatedKMLInput += splitKMLInput[splitKMLInput.length - 1];

			console.log("Validated KML:");
			console.log(this.validatedKMLInput);

			let data: StringResponseData = {
				value: this.validatedKMLInput,
			};

			this.response.emit([data]);
		}
		else {
			this.validatedKMLInput = "";
			this.validationState.emit(ResponseValidationState.INVALID);
		}
	}


	private onFileSelected(event) {

		const file: File = event.target.files[0];

		if (file) {

			// this.fileName = file.name;

			// const formData = new FormData();

			// let data: StringResponseData = {
			// 	value: "",
			// }

			// formData.append("thumbnail", file);

			// this.http.post(this.uploadURL, JSON.stringify(this._UploadUrl), this.getRequestHeaders()).pipe(
			// 	catchError((error) => {
			// 		return this.handleError(error, () => this.getDeleteUploadedFileEndopint(filePath));
			// 	})
			// );
			if (!window.FileReader) return;

			var fileReader = new FileReader();

			fileReader.onload = (evt) => {
				if (evt.target.readyState != 2) return;
				if (evt.target.error) {
					alert('Error while reading file');
					return;
				}

				this.kmlInput = evt.target.result.toString();
				this.ReadKMLString();
			};

			fileReader.readAsText(file);
		}

	}

	private ReadKMLString() {
		// validate uploaded kml file string
		if (this.kmlInput.search("http://www.opengis.net/kml") != -1
			&& this.kmlInput.search("Location history from " + this.kmlDate + " to " + this.kmlDate) != -1
			&& this.kmlInput.search("<Placemark>") != -1
		) {
			this.KMLEventArray = new Array();
			this.KMLLocationsArray = new Array();

			this.KMLValidationSelected = new Array();

			let splitKML = this.kmlInput.split("<Placemark><name>");

			for (let i = 1; i < splitKML.length; i++) {
				let tempDate = splitKML[i].split("<TimeSpan><begin>")[1].split("</begin>")[0].split("T")[0];
				let tempTime = splitKML[i].split("<TimeSpan><begin>")[1].split("</begin>")[0].split("T")[1].substring(0, 5);

				let parsedDateTime = this.ParseKMLDateTime(tempDate, tempTime);

				tempDate = parsedDateTime[0];
				tempTime = parsedDateTime[1];

				let tempName = splitKML[i].split("</name>")[0];

				if (i == 1){
					tempDate = "Start location";
					tempTime = " ";
				}

				let tempAddress = splitKML[i].split("<address>")[1].split("</address>")[0];
				if (tempAddress.trim() === "" || !tempAddress.trim()) {
					tempAddress = "N/A";
				}

				else {
					let tempArray = new Array();
					tempArray.push(tempDate);

					if (tempTime == " "){
						tempArray.push("Start");
					}
					else {
						tempArray.push(tempTime);
					}
					tempArray.push(tempName);
					tempArray.push(tempAddress);

					this.KMLLocationsArray.push(tempArray);
				}

				let tempEventArray = new Array();
				tempEventArray.push(tempDate);
				tempEventArray.push(tempTime);
				tempEventArray.push(tempName);
				tempEventArray.push(tempAddress);

				this.KMLEventArray.push(tempEventArray);
				this.KMLValidationSelected.push("blank");
			}

			console.log("KML Event array");
			console.log(this.KMLEventArray);

			// create lines geojson
			let splitLinesKML = this.kmlInput.split("</tesselate><coordinates>");

			for (let i = 1; i < splitLinesKML.length; i++) {
				let templine = splitLinesKML[i].split("</coordinates>")[0];
				let splitcoords = templine.split(",0 ");
				let tempcoords = new Array();

				for (let i = 0; i < splitcoords.length - 1; i++) {
					let tempLong = splitcoords[i].split(",")[0];
					let tempLat = splitcoords[i].split(",")[1];

					tempcoords.push(new Array(tempLong, tempLat));
				}

				this.LinesGeoJson.features.push({
					"type": "Feature",
					"geometry": {
						"type": "LineString",
						"coordinates": tempcoords
					},
					"properties": {}
				});
			}

			// create points geojson
			let splitPointKML = this.kmlInput.split("<Point><coordinates>");

			let avgLong = 0;
			let avgLat = 0;

			console.log(this.KMLLocationsArray);

			for (let i = 1; i < splitPointKML.length; i++) {
				let temppoint = splitPointKML[i].split("</coordinates>")[0];

				let tempLong = temppoint.split(",")[0];
				let tempLat = temppoint.split(",")[1];

				this.PointsGeoJson.features.push({
					"type": "Feature",
					"geometry": {
						"type": "Point",
						"coordinates": [tempLong, tempLat]
					},
					"properties": {
						"number": this.KMLLocationsArray[i-1][1]
					}
				});

				avgLong += parseFloat(tempLong);
				avgLat += parseFloat(tempLat);

				this.KMLPointsCoordArray.push([tempLong, tempLat]);
			}

			avgLong = avgLong / (splitPointKML.length - 1);
			avgLat = avgLat / (splitPointKML.length - 1);

			console.log("Map center: " + avgLong + ", " + avgLat);

			// init mapbox map
			const map = new mapboxgl.Map({
				accessToken: 'pk.eyJ1Ijoic3RldmViYWtlcjEyMyIsImEiOiJjbGV6NXFjN28wb3JyM3JvMG44NmJ6MG9uIn0.cadTKiTzbZc3VWTo9Rsczg',
				container: this.mapElement.nativeElement, // container ID
				style: 'mapbox://styles/mapbox/streets-v12', // style URL
				center: [avgLong, avgLat], // starting position [lng, lat]
				zoom: 13, // starting zoom
			});

			// map on load
			map.on('load', () => {
				// add map sources
				map.addSource('kmlpoints', {
					'type': 'geojson',
					'data': this.PointsGeoJson as GeoJSON.FeatureCollection
				});

				map.addSource('kmllines', {
					'type': 'geojson',
					'data': this.LinesGeoJson as GeoJSON.FeatureCollection
				});

				// add map layers
				map.addLayer({
					id: 'kml-lines',
					type: 'line',
					source: 'kmllines',
					'layout': {
						'line-join': 'round',
						'line-cap': 'round'
					},
					'paint': {
						'line-color': '#888',
						'line-width': 2.5
					}
				});

				map.addLayer({
					id: 'kml-points',
					type: 'circle',
					source: 'kmlpoints',
					paint: {
						'circle-radius': 14,
						'circle-color': '#000'
					},
				});

				map.addLayer({
					"id": "point-labels",
					"type": "symbol",
					"source": "kmlpoints",
					"layout": {
						"text-field": '{number}',
						"text-size": 16
					},
					"paint": {
						"text-color": "#ffffff",
						"text-halo-color": "black",
						"text-halo-width": 2,
						"text-halo-blur": 1
					}
				});

				// fit map zoom
				map.fitBounds(this.calcBoundsFromCoordinates(this.KMLPointsCoordArray), {
					padding: 50
				});
			});

			/* let data: StringResponseData = {
				value: this.kmlInput,
			};
	
			this.response.emit([data]); */

			// set valid kml var to true
			this.KMLFileValid = true;
			this.KMLFileLoaded = true;
		}
		// invalid kml file
		else if (this.kmlInput.search("http://www.opengis.net/kml") == -1) {
			this.KMLWarningString = "Invalid File: File is not in KML format";
			this.KMLFileValid = false;
			this.KMLFileLoaded = false;
		}

		else if (this.kmlInput.search("Location history from " + this.kmlDate + " to " + this.kmlDate) == -1) {
			this.KMLWarningString = "Date Error: KML File is not from specified date";
			this.KMLFileValid = false;
			this.KMLFileLoaded = false;
		}

		else if (this.kmlInput.search("<Placemark>") == -1) {
			this.KMLWarningString = "KML file is empty; If you stayed at home all day this day, please manually add your home location for this day on your Google timeline and retry";
			this.KMLFileValid = false;
			this.KMLFileLoaded = false;
		}

		else {
			this.KMLWarningString = "Error: Uploaded file is invalid";
			this.KMLFileValid = false;
			this.KMLFileLoaded = false;
		}
	}

	private getSWCoordinates(coordinatesCollection) {
		const lowestLng = Math.min(
			...coordinatesCollection.map((coordinates) => coordinates[0])
		);
		const lowestLat = Math.min(
			...coordinatesCollection.map((coordinates) => coordinates[1])
		);

		return [lowestLng, lowestLat];
	}

	private getNECoordinates(coordinatesCollection) {
		const highestLng = Math.max(
			...coordinatesCollection.map((coordinates) => coordinates[0])
		);
		const highestLat = Math.max(
			...coordinatesCollection.map((coordinates) => coordinates[1])
		);

		return [highestLng, highestLat];
	}

	private calcBoundsFromCoordinates(coordinatesCollection) {
		let returnTuple: [number, number, number, number];
		returnTuple = [this.getSWCoordinates(coordinatesCollection)[0], this.getSWCoordinates(coordinatesCollection)[1], this.getNECoordinates(coordinatesCollection)[0], this.getNECoordinates(coordinatesCollection)[1]];

		return returnTuple;
	}

	private ParseKMLDateTime_old(tempDate, tempTime) {
		let dateTimeObj = new Date(
			parseInt(tempDate.substring(0, 4)),
			parseInt(tempDate.substring(5, 7)),
			parseInt(tempDate.substring(8)),
			parseInt(tempTime.substring(0, 2)),
			parseInt(tempTime.substring(3)),
			0, 0
		);

		dateTimeObj.setUTCHours(dateTimeObj.getHours() + this.KMLTimezoneAdjust);

		var formattedDateString =
			dateTimeObj.getUTCFullYear() + "-" +
			("0" + (dateTimeObj.getUTCMonth())).slice(-2) + "-" +
			("0" + dateTimeObj.getUTCDate()).slice(-2) + " " +
			("0" + dateTimeObj.getUTCHours()).slice(-2) + ":" +
			("0" + dateTimeObj.getUTCMinutes()).slice(-2);

		console.log("Timezone adjust: " + this.KMLTimezoneAdjust);
		console.log("Formatted date string: " + formattedDateString);

		tempDate = dateTimeObj.getUTCFullYear() + "-" +
			("0" + (dateTimeObj.getUTCMonth())).slice(-2) + "-" +
			("0" + dateTimeObj.getUTCDate()).slice(-2);

		tempTime = ("0" + dateTimeObj.getUTCHours()).slice(-2) + ":" +
			("0" + dateTimeObj.getUTCMinutes()).slice(-2);

		return [tempDate, tempTime];
	}

	private ParseKMLDateTime(tempDate, tempTime) {
		let DaysOfMonth = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

		let year = parseInt(tempDate.substring(0, 4));
		let month = parseInt(tempDate.substring(5, 7));
		let date = parseInt(tempDate.substring(8));

		let hour = parseInt(tempTime.substring(0, 2));
		let min = parseInt(tempTime.substring(3));

		hour += this.KMLTimezoneAdjust;

		if (hour < 0) {
			hour += 24;
			date--;
			if (date < 1 && month != 1) {
				date = DaysOfMonth[month - 1]
				month--;
			}
			else if (date < 1 && month == 1) {
				date = DaysOfMonth[12]
				month = 12;
			}
		}
		else if (hour > 24) {
			hour -= 24;
			date++;
			if (date > DaysOfMonth[month] && month != 12) {
				date = 1
				month++;
			}
			else if (date > DaysOfMonth[month] && month == 12) {
				date = DaysOfMonth[1]
				month = 1;
			}
		}

		let formattedhour = hour.toString();
		let formattedmin = min.toString();

		if (hour < 10) {
			formattedhour = "0" + hour;
		}
		if (min < 10) {
			formattedmin = "0" + min;
		}

		var formattedDateString = year + "-" + month + "-" + date + " " + formattedhour + ":" + formattedmin;

		console.log("Timezone adjust: " + this.KMLTimezoneAdjust);
		console.log("Formatted date string: " + formattedDateString);

		tempDate = year + "-" + month + "-" + date;
		tempTime = formattedhour + ":" + formattedmin;

		return [tempDate, tempTime];
	}

	private LoadValidationFromKML() {
		let splitKML = this.kmlInput.split("<Validation>");
		this.kmlInput = "";
		this.KMLValidationSelected = [];

		this.kmlInput += splitKML[0];

		for (let i = 1; i < splitKML.length; i++) {
			this.KMLValidationSelected.push(splitKML[i].split("</Validation>")[0]);

			this.kmlInput += splitKML[i].split("</Validation>")[1];
		}
	}
}
