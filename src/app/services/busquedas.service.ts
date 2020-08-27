import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { Hospital } from '../models/hospital.model';
import { Medico } from '../models/medico.model';

@Injectable({
  providedIn: 'root',
})
export class BusquedasService {
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

  buscar(tipo: 'usuarios' | 'medicos' | 'hospitales', filtro: string) {
    return this.http
      .get<any[]>(
        `${environment.baseUrl}/busqueda/coleccion/${tipo}/${filtro}`,
        this.headers
      )
      .pipe(
        map((resp: any) => {
          switch (tipo) {
            case 'usuarios':
              return this.transformarUsuarios(resp.resultados);
            case 'hospitales':
              return this.transformarHospitales(resp.resultados);
            case 'medicos':
              return this.transformarMedicos(resp.resultados);

            default:
              break;
          }
        })
      );
  }

  busquedaGlobal(filtro: string) {
    return this.http.get(
      `${environment.baseUrl}/busqueda/${filtro}`,
      this.headers
    );
  }

  private transformarUsuarios(resultados: any): Usuario[] {
    return resultados.map(
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
  }

  private transformarHospitales(resultados: any): Hospital[] {
    return resultados.map(
      (hospital) =>
        new Hospital(
          hospital.nombre,
          hospital._id,
          hospital.usuario,
          hospital.img
        )
    );
  }

  private transformarMedicos(resultados: any): Medico[] {
    return resultados.map(
      (medico) =>
        new Medico(
          medico.nombre,
          medico._id,
          medico.usuario,
          medico.hospital,
          medico.img
        )
    );
  }
}
