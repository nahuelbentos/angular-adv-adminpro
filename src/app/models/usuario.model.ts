import { environment } from 'src/environments/environment';

export class Usuario {
  constructor(
    public nombre: string,
    public email: string,
    public password?: string,
    public img?: string,
    public google?: boolean,
    public role?: string,
    public uid?: string
  ) {}

  get imagenUrl() {
    if (!this.img) {
      return `${environment.baseUrl}/upload/usuarios/no-image`;
    } else if (this.img.includes('https')) {
      return this.img;
    } else {
      return `${environment.baseUrl}/upload/usuarios/${this.img}`;
    }
  }
}
