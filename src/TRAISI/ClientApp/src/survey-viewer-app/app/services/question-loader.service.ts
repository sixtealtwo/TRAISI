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
import 'rxjs/add/observable/of';
import * as _ from 'lodash';

declare const SystemJS;

@Injectable({
	providedIn: 'root'
})
export class QuestionLoaderService {

	private _componentFactories: { [type: string]: ComponentFactory<any>; } = {};

	/**
	 *
	 * @param _questionLoaderEndpointService
	 * @param compiler
	 * @param injector
	 * @param moduleLoader
	 */
	constructor(
		private _questionLoaderEndpointService: QuestionLoaderEndpointService,
		private compiler: Compiler,
		private injector: Injector
	) {

	}

	/**
	 *
	 * @param questionType
	 */
	public getQuestionComponentFactory(questionType: string): Observable<any> {
		SystemJS.registry.set('@angular/core', SystemJS.newModule(AngularCore));
		SystemJS.registry.set('@angular/common', SystemJS.newModule(AngularCommon));
		SystemJS.registry.set('@angular/common/http', SystemJS.newModule(AngularHttp));

		//reuse the preloaded component factory
		if (questionType in this._componentFactories) {
			return Observable.create(
				(observer: Observer<ComponentFactory<any>>) => {

					observer.next(this._componentFactories[questionType]);


					observer.complete();
				});
		}

		// create and obserer and return the component factory after it has finished importing
		let obs: Observable<ComponentFactory<any>> = Observable.create(
			(observer: Observer<ComponentFactory<any>>) => {
				SystemJS.import(
					this._questionLoaderEndpointService.getClientCodeEndpointUrl(questionType)
				)
					.then(module => {

						const moduleFactory = this.compiler.compileModuleAndAllComponentsSync(module.default);
						const moduleRef: NgModuleRef<any> = moduleFactory.ngModuleFactory.create(this.injector);
						const widgets = moduleRef.injector.get('widgets', 'notFound');
						const resolver = moduleRef.componentFactoryResolver;


						let widget = _.find(widgets[0], item => {
							return item.id.toLowerCase() === questionType.toLowerCase();
						});


						//resolver.
						const componentFactory: ComponentFactory<any> = resolver.resolveComponentFactory(widget.component);

						observer.next(componentFactory);

						observer.complete();
					})
					.catch(error => {
						console.log(error);
						console.log('Error: ' + error);
					});
			}
		);

		return obs;
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

				})
			});


	}
}
