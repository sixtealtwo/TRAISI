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
	KMLFileValid:boolean = true;
	KMLFileLoaded:boolean = false;

	KMLTimes = new Array();
	KMLNames = new Array();
	KMLAddresses = new Array();

	KMLEventArray = new Array();

	KMLValidationSelected = new Array();

	KMLWarningString:string = "";
	
	kmlDate:string = "2023-01-18";

	KMLTimezoneAdjust = -5;


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

	}

	public traisiOnInit(): void {}

	// private onSavedResponseData(): void {}

	private onSavedResponseData: (response: ResponseData<ResponseTypes.String>[] ) => void = (
		response: ResponseData<ResponseTypes.String>[] 
	) => {
		if (response.length > 0) {
			let stringResponse = <StringResponseData>response[0];
			//this.kmlInput = stringResponse.value;
			if (this.isInputValid(this.validatedKMLInput)) {
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
	 * @param kmlInput
	 */
	 private isInputValid(kmlInput: string): boolean {
		if (kmlInput) {
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
			&& this.KMLValidationSelected.length == this.KMLEventArray.length){
			let splitKMLInput = this.kmlInput.split("<Placemark>");
			this.validatedKMLInput = "";

			for (let i = 0; i < splitKMLInput.length - 1; i++) {
				this.validatedKMLInput += splitKMLInput[i] + "<Placemark><Validation>" + this.KMLValidationSelected[i] + "</Validation>";
			}
			this.validatedKMLInput += splitKMLInput[splitKMLInput.length - 1];
		}
		else{
			this.validatedKMLInput = "";
			this.validationState.emit(ResponseValidationState.INVALID);
		}
	}


	private onFileSelected(event) {
		
		const file:File = event.target.files[0];

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
			if(!window.FileReader) return;

			var fileReader = new FileReader();

			fileReader.onload = (evt) => {
				let configDate = this.configuration.date.toString();
				this.kmlDate = configDate.slice(0,4) + "-" + configDate.slice(4,6)+ "-" + configDate.slice(6,8);
				//this.kmlDate = configDate;

				if(evt.target.readyState != 2) return;
				if(evt.target.error) {
					alert('Error while reading file');
					return;
				}

				this.kmlInput = evt.target.result.toString();

				// validate uploaded kml file string
				if (this.kmlInput.search("http://www.opengis.net/kml") != -1
					&& this.kmlInput.search("Location history from " + this.kmlDate + " to " + this.kmlDate) != -1
					){
					// set valid kml var to true
					this.KMLFileValid = true;
					this.KMLFileLoaded = true;

					this.KMLNames = new Array();
					this.KMLAddresses = new Array();
					this.KMLTimes = new Array();
					this.KMLEventArray = new Array();

					let splitKML = this.kmlInput.split("<Placemark><name>");

					for (let i = 1; i < splitKML.length; i++) {
						let tempDate = splitKML[i].split("<TimeSpan><begin>")[1].split("</begin>")[0].split("T")[0];

						let tempTime = splitKML[i].split("<TimeSpan><begin>")[1].split("</begin>")[0].split("T")[1].substring(0,5);
						
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

						this.KMLNames.push(tempDate);
						this.KMLTimes.push(tempTime);

						let tempName = splitKML[i].split("</name>")[0];
						this.KMLNames.push(tempName);

						let tempAddress = splitKML[i].split("<address>")[1].split("</address>")[0];
						if (tempAddress.trim() === "" || !tempAddress.trim()){
							tempAddress = "N/A";
						}
						this.KMLAddresses.push(tempAddress);

						let tempEventArray = new Array();
						tempEventArray.push(tempDate);
						tempEventArray.push(tempTime);
						tempEventArray.push(tempName);
						tempEventArray.push(tempAddress);

						this.KMLEventArray.push(tempEventArray);
					} 

					/* let data: StringResponseData = {
						value: this.kmlInput,
					};
	
					this.response.emit([data]); */
				}
				// invalid kml file
				else if (this.kmlInput.search("http://www.opengis.net/kml") == -1){
					this.KMLWarningString = "Invalid File: File is not in KML format";
					this.KMLFileValid = false;
					this.KMLFileLoaded = false;
				}

				else if (this.kmlInput.search("Location history from " + this.kmlDate + " to " + this.kmlDate) == -1){
					this.KMLWarningString = "Date Error: KML File is not from specified date";
					this.KMLFileValid = false;
					this.KMLFileLoaded = false;
				}

				else {
					this.KMLWarningString = "Error: Uploaded file is invalid";
					this.KMLFileValid = false;
					this.KMLFileLoaded = false;
				}
			};

			fileReader.readAsText(file);
        }

	}
	
}
