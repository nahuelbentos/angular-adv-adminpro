import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Medico } from '../models/medico.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MedicoService {
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

  cargarMedicos() {
    return this.http
      .get(`${environment.baseUrl}/medicos`, this.headers)
      .pipe(map((resp: { ok: boolean; medicos: Medico[] }) => resp.medicos));
  }
  getMedicoById(id: string) {
    return this.http
      .get(`${environment.baseUrl}/medicos/${id}`, this.headers)
      .pipe(map((resp: { ok: boolean; medico: Medico }) => resp.medico));
  }

  crearMedico(medico: Medico) {
    return this.http.post(
      `${environment.baseUrl}/medicos`,
      medico,
      this.headers
    );
  }

  modificarMedicos(medico: Medico) {
    return this.http.put(
      `${environment.baseUrl}/medicos/${medico._id}`,
      medico,
      this.headers
    );
  }

  eliminarMedicos(_id: string) {
    return this.http.delete(
      `${environment.baseUrl}/medicos/${_id}`,
      this.headers
    );
  }
}
