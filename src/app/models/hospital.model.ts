export class Hospital {
  constructor(
    public nombre: string,
    public _id?: string,
    public usuario?: _HospitalUser,
    public img?: string
  ) {}
}

interface _HospitalUser {
  nombre: string;
  _id: string;
  img: string;
}
