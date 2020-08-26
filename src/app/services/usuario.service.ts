import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, map, catchError, delay } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { environment } from 'src/environments/environment';
import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { Usuario } from '../models/usuario.model';
import { CargarUsuarios } from '../interfaces/cargar-usuarios.interfaces';

declare const gapi: any;

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  public auth2: any;
  public usuario: Usuario;

  constructor(
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.googleInit();
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }
  get uid(): string {
    return this.usuario.uid || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
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
    return this.http
      .get(`${environment.baseUrl}/login/renew`, this.headers)
      .pipe(
        map((res: any) => {
          const { email, google, nombre, role, img = '', uid } = res.usuario;
          this.usuario = new Usuario(nombre, email, '', img, google, role, uid);
          localStorage.setItem('token', res.token);
          return true;
        }),
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

  actualizarPerfil(data: { email: string; nombre: string; role: string }) {
    data = {
      ...data,
      role: this.usuario.role,
    };

    return this.http.put(
      `${environment.baseUrl}/usuarios/${this.uid}`,
      data,
      this.headers
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

  cargarUsuarios(desde: number = 0) {
    return this.http
      .get<CargarUsuarios>(
        `${environment.baseUrl}/usuarios?desde=${desde}`,
        this.headers
      )
      .pipe(
        delay(500),
        map((resp) => {
          const usuarios = resp.usuarios.map(
            (user) =>
              new Usuario(
                user.nombre,
                user.email,
                '',
                user.img,
                user.google,
                user.role,
                user.uid
              )
          );
          return {
            total: resp.total,
            usuarios,
          };
        })
      );
  }
}
