import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterForm } from '../interfaces/register-form.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  constructor(private http: HttpClient) {}

  crearUsuario(formData: RegisterForm) {
    console.log('creando usuairo');
    return this.http.post(`${environment.baseUrl}/usuarios`, formData);
  }
}
