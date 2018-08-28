import {Injectable} from "@angular/core";
import {
	ActivatedRouteSnapshot,
	CanActivate,
	CanActivateChild,
	CanLoad, Route,
	Router,
	RouterStateSnapshot
} from "@angular/router";

import {Observable} from "rxjs";
import {AuthService} from "../../../admin-app/app/services/auth.service";
import {Permission} from "../../../admin-app/app/models/permission.model";


@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
	constructor(private authService: AuthService, private router: Router) {
	}

	/**
	 *
	 * @param route
	 * @param state
	 */
	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
		const url: string = state.url;

		return this.checkLogin(url);
	}

	/**
	 *
	 * @param childRoute
	 * @param state
	 */
	canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
		return this.canActivate(childRoute, state);
	}

	/**
	 *
	 * @param route
	 */
	canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
		const url = `/${route.path}`;
		return this.checkLogin(url);
	}

	/**
	 *
	 * @param url
	 * @param surveyName
	 */
	checkLogin(url: string): boolean {

		if (this.authService.isLoggedIn && this.authService.userPermissions.some(p => p === Permission.viewSurveysPermission)) {
			return true;
		}


		this.authService.loginRedirectUrl = url;
		this.router.navigate(['/survey/start']);

		return false;
	}

}
