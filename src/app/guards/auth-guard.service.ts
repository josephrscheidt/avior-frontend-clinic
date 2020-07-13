import { Injectable } from '@angular/core';
import { LoginService } from './../login/service/login.service';	
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()

export class AuthGuard implements CanActivate {


	constructor(private _loginService: LoginService, private _router: Router) {
	}

	canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

		if (this._loginService.isLogged()) {
			return true;
		}

		// navigate to login page
		this._router.navigate(['/login']);
		// you can save redirect url so after authing we can move them back to the page they requested
		return false;
	}

}