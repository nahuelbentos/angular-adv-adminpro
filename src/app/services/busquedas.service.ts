import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

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
      .pipe(map((resp: any) => resp.resultados));
  }
}
