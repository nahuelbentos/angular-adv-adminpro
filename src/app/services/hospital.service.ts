import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Hospital } from '../models/hospital.model';

@Injectable({
  providedIn: 'root',
})
export class HospitalService {
  constructor(private http: HttpClient) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }

  cargarHospitales(desde: number = 0) {
    return this.http
      .get(`${environment.baseUrl}/hospitales`, this.headers)
      .pipe(
        map((resp: { ok: boolean; hospitales: Hospital[] }) => resp.hospitales)
      );
  }

  crearHospitales(nombre: string) {
    return this.http.post(
      `${environment.baseUrl}/hospitales`,
      { nombre },
      this.headers
    );
  }

  modificarHospitales(_id: string, nombre: string) {
    return this.http.put(
      `${environment.baseUrl}/hospitales/${_id}`,
      { nombre },
      this.headers
    );
  }
  eliminarHospitales(_id: string) {
    return this.http.delete(
      `${environment.baseUrl}/hospitales/${_id}`,
      this.headers
    );
  }
}
