import {
	Compiler,
	Component,
	Injector,
	SkipSelf,
	ViewChild,
	ViewContainerRef,
	Injectable,
	ComponentFactory, NgModuleRef, ComponentRef
} from '@angular/core';
import {QuestionLoaderEndpointService} from './question-loader-endpoint.service';
import {Observable, of, Operator, Subscriber, Observer} from 'rxjs';
import * as AngularCore from '@angular/core';
import * as AngularCommon from '@angular/common';
import * as AngularHttp from '@angular/common/http';
import * as AngularForms from '@angular/forms';
import * as NgxBootstrap from 'ngx-bootstrap';
import * as BrowserModule from '@angular/platform-browser';
import * as icons from '@fortawesome/angular-fontawesome';
import 'rxjs/add/observable/of';
import {find} from 'lodash';
import { SurveyResponderService } from './survey-responder.service';

declare const SystemJS;

@Injectable({
	providedIn: 'root'
})
export class QuestionLoaderService {

	private _componentFactories: { [type: string]: ComponentFactory<any>; } = {};

	private _moduleRefs: { [type: string]: NgModuleRef<any>; } = {};

	/**
	 *Creates an instance of QuestionLoaderService.
	 * @param {QuestionLoaderEndpointService} _questionLoaderEndpointService
	 * @param {Compiler} compiler
	 * @param {Injector} injector
	 * @param {SurveyResponderService} _responderService
	 * @memberof QuestionLoaderService
	 */
	constructor(
		private _questionLoaderEndpointService: QuestionLoaderEndpointService,
		private compiler: Compiler,
		private injector: Injector,
		private _responderService: SurveyResponderService
	) {
		SystemJS.config({transpiler: false});
	}

	/**
	 *
	 * @param questionType
	 */
	public getQuestionComponentFactory(questionType: string): Observable<any> {
		SystemJS.registry.set('@angular/core', SystemJS.newModule(AngularCore));
		SystemJS.registry.set('@angular/common', SystemJS.newModule(AngularCommon));
		SystemJS.registry.set('@angular/common/http', SystemJS.newModule(AngularHttp));
		SystemJS.registry.set('@angular/forms', SystemJS.newModule(AngularForms));
		SystemJS.registry.set('@angular/platform-browser', SystemJS.newModule(BrowserModule));
		SystemJS.registry.set('ngx-bootstrap', SystemJS.newModule(NgxBootstrap));
		SystemJS.registry.set('@fortawesome/angular-fontawesome', SystemJS.newModule(icons));

		// reuse the preloaded component factory
		if (questionType in this._componentFactories) {
			return Observable.create(
				(observer: Observer<ComponentFactory<any>>) => {

					observer.next(this._componentFactories[questionType]);


					observer.complete();
				});
		}


		// if the module has already loaded.. but the question does not exist yet
		else if (questionType in this._moduleRefs) {
			return Observable.create(
				(observer: Observer<ComponentFactory<any>>) => {

					const componentFactory: ComponentFactory<any> = this.createComponentFactory(this._moduleRefs[questionType], questionType);

					this._componentFactories[questionType] = componentFactory;
					observer.next(componentFactory);

					observer.complete();
				});
		}
		else {

			// load and compile the module
			return Observable.create(
				(observer: Observer<ComponentFactory<any>>) => {
					SystemJS.import(
						this._questionLoaderEndpointService.getClientCodeEndpointUrl(questionType)
					)
						.then(module => {



							const moduleFactory = this.compiler.compileModuleAndAllComponentsSync(module.default);
							const moduleRef: NgModuleRef<any> = moduleFactory.ngModuleFactory.create(this.injector);

							const componentFactory: ComponentFactory<any> = this.createComponentFactory(moduleRef, questionType);
							this._componentFactories[questionType] = componentFactory;
							observer.next(componentFactory);

							observer.complete();
						})
						.catch(error => {
							console.log(error);
							console.log('Error: ' + error);
						});
				}
			);
		}

	}

	/**
	 *
	 * @param moduleRef
	 * @param questionType
	 */
	private createComponentFactory(moduleRef: NgModuleRef<any>, questionType): ComponentFactory<any> {

		const widgets = moduleRef.injector.get('widgets', 'notFound');
		const resolver = moduleRef.componentFactoryResolver;


		let widget = find(widgets[0], item => {
			return item.id.toLowerCase() === questionType.toLowerCase();
		});


		const componentFactory: ComponentFactory<any> = resolver.resolveComponentFactory(widget.component);

		return componentFactory;
	}


	/**
	 *
	 * @param questionType
	 * @param viewContainerRef
	 */
	public loadQuestionComponent(questionType: string, viewContainerRef: ViewContainerRef): Observable<ComponentRef<any>> {

		return Observable.create(
			(observer: Observer<ComponentRef<any>>) => {
				this.getQuestionComponentFactory(questionType).subscribe(componentFactory => {

					let componentRef = viewContainerRef.createComponent(componentFactory, undefined, this.injector);
					observer.next(componentRef);
					observer.complete();

				});
			});


	}
}
