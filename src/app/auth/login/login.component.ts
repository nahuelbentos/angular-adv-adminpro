import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

declare const gapi: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public auth2: any;
  public formSubmitted = false;
  public loginForm = this.fb.group({
    email: [
      localStorage.getItem('email') || '',
      [Validators.required, Validators.email],
    ],
    password: ['', [Validators.required]],
    remember: [false],
  });
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.renderButton();
  }

  login(event) {
    console.log(this.loginForm.value);

    this.usuarioService.login(this.loginForm.value).subscribe(
      (res) => {
        console.log(res);
        if (this.loginForm.get('remember').value) {
          localStorage.setItem('email', this.loginForm.get('email').value);
        } else {
          localStorage.removeItem('email');
        }

        this.router.navigateByUrl('/');
      },
      (err) => Swal.fire('Error', err.error.msg, 'error')
    );

    // this.router.navigateByUrl('/dashboard');
  }

  renderButton() {
    gapi.signin2.render('my-signin2', {
      scope: 'profile email',
      width: 240,
      height: 50,
      longtitle: true,
      theme: 'dark',
    });
    this.startApp();
  }

  async startApp() {
    await this.usuarioService.googleInit();
    this.auth2 = this.usuarioService.auth2;

    this.attachSignin(document.getElementById('my-signin2'));
  }

  attachSignin(element) {
    console.log(element.id);
    this.auth2.attachClickHandler(
      element,
      {},
      (googleUser) => {
        console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
        console.log('Logged in as: ', googleUser);
        const id_token = googleUser.getAuthResponse().id_token;
        console.log('hsdgasgadgaf' + id_token);

        this.usuarioService.loginGoogle(id_token).subscribe((res) => {
          this.ngZone.run(() => {
            this.router.navigateByUrl('/');
          });
        });
      },
      (error) => {
        alert(JSON.stringify(error, undefined, 2));
      }
    );
  }
}
