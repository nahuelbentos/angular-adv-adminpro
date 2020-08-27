import { Hospital } from './hospital.model';

export class Medico {
  constructor(
    public nombre: string,
    public _id?: string,
    public usuario?: UsuarioCreacion,
    public hospital?: Hospital,
    public img?: string
  ) {}
}

interface UsuarioCreacion {
  _id: string;
  nombre: string;
  img: string;
}
