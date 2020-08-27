import { Component, OnInit, OnDestroy } from '@angular/core';
import { HospitalService } from '../../../services/hospital.service';
import { Hospital } from '../../../models/hospital.model';
import Swal from 'sweetalert2';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { BusquedasService } from 'src/app/services/busquedas.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styleUrls: ['./hospitales.component.css'],
})
export class HospitalesComponent implements OnInit, OnDestroy {
  public hospitales: Hospital[] = [];
  public hospitalesTemp: Hospital[] = [];
  public cargando: boolean = true;
  public totalHospitales: number = 0;

  public imgSubs: Subscription;
  constructor(
    private hospitalService: HospitalService,
    private busquedasService: BusquedasService,
    private modalImagenService: ModalImagenService
  ) {}

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }
  ngOnInit(): void {
    this.cargarHospitales();
    // Si se encuentra una nueva imagen, cargo nuevamente los datos
    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(delay(100))
      .subscribe((img) => {
        this.cargarHospitales();
      });
  }

  cargarHospitales() {
    this.cargando = true;
    this.hospitalService.cargarHospitales().subscribe((hospitales) => {
      console.log(hospitales);
      this.hospitales = hospitales;
      this.totalHospitales = hospitales.length;
      this.cargando = false;
    });
  }

  async abrirSweetAlert() {
    const { value = '' } = await Swal.fire<string>({
      title: 'Crear hospital',
      text: 'Ingrese el nombre del nuevo hospital',
      input: 'text',
      inputPlaceholder: 'Nombre del hospital',
      showCancelButton: true,
    });
    console.log(value);

    if (value.trim().length > 0) {
      this.hospitalService.crearHospitales(value).subscribe((res: any) => {
        Swal.fire('Guardado', `Se guardo el hospital ${value}`, 'success');
        this.hospitales.push(res.hospital);
      });
      Swal.fire(`Entered value: ${value}`);
    }
  }

  guardarCambios(hospital: Hospital) {
    this.hospitalService
      .modificarHospitales(hospital._id, hospital.nombre)
      .subscribe((res) => Swal.fire('Actualizado', hospital.nombre, 'success'));
  }

  eliminarHospital(hospital: Hospital) {
    this.hospitalService.eliminarHospitales(hospital._id).subscribe((res) => {
      this.cargarHospitales();
      Swal.fire('Borrado', hospital.nombre, 'success');
    });
  }

  abrirModal(hospital: Hospital) {
    console.log(hospital);
    this.modalImagenService.abrirModal(
      'hospitales',
      hospital._id,
      hospital.img
    );
  }

  buscar(filtro: string) {
    if (filtro.length === 0) {
      return this.cargarHospitales();
    }
    this.busquedasService.buscar('hospitales', filtro).subscribe((res) => {
      this.hospitales = res;
      console.log(res);
    });
  }
}
