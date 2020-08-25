import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { environment } from 'src/environments/environment';
import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';

declare const gapi: any;

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  public auth2: any;
  constructor(
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.googleInit();
  }

  googleInit() {
    return new Promise((resolve, reject) => {
      console.log('google init');

      gapi.load('auth2', () => {
        // Retrieve the singleton for the GoogleAuth library and set up the client.
        this.auth2 = gapi.auth2.init({
          client_id:
            '830103970258-vaiihvutkqsm40perqv6dqr83qd73ide.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
          // Request scopes in addition to 'profile' and 'email'
          //scope: 'additional_scope'
        });

        resolve();
      });
    });
  }

  validarToken(): Observable<boolean> {
    const token = localStorage.getItem('token') || '';
    return this.http
      .get(`${environment.baseUrl}/login/renew`, {
        headers: {
          'x-token': token,
        },
      })
      .pipe(
        tap((res: any) => {
          localStorage.setItem('token', res.token);
        }),
        map((resp) => true),
        // El catchError atrapa el error que pudiese ocurrir en este flujo y el "of" retorna un observable con el valor "false"
        catchError((error) => of(false))
      );
  }

  crearUsuario(formData: RegisterForm) {
    console.log('creando usuairo');
    return this.http.post(`${environment.baseUrl}/usuarios`, formData).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);
        sessionStorage.setItem('token', res.token);
        console.log(res);
      })
    );
  }

  login(formData: LoginForm) {
    console.log('login usuairo');
    return this.http.post(`${environment.baseUrl}/login`, formData).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);
        sessionStorage.setItem('token', res.token);
        console.log(res);
      })
    );
  }

  loginGoogle(token: string) {
    console.log('login usuairo');
    return this.http
      .post(`${environment.baseUrl}/login/google`, { token })
      .pipe(
        tap((res: any) => {
          localStorage.setItem('token', res.token);
          sessionStorage.setItem('token', res.token);
          console.log(res);
        })
      );
  }

  logout() {
    localStorage.removeItem('token');

    this.auth2.signOut().then(() => {
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      });
      console.log('User signed out.');
    });
  }
}
