import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';

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
              console.log(resp);

              return this.transformarUsuarios(resp.resultados);
              break;

            default:
              break;
          }
        })
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
}
