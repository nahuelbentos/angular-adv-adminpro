import { Component, OnInit, OnDestroy } from '@angular/core';
import { MedicoService } from 'src/app/services/medico.service';
import { Medico } from 'src/app/models/medico.model';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styleUrls: ['./medicos.component.css'],
})
export class MedicosComponent implements OnInit, OnDestroy {
  public cargando: boolean = true;
  public medicos: Medico[] = [];
  public medicosTemp: Medico[] = [];
  totalMedicos: number = 0;

  public imgSubs: Subscription;

  constructor(
    private medicoService: MedicoService,
    private busquedasService: BusquedasService,
    private modalImagenService: ModalImagenService
  ) {}

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarMedicos();
    // Si se encuentra una nueva imagen, cargo nuevamente los datos
    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(delay(150))
      .subscribe((img) => {
        this.cargarMedicos();
      });
  }

  cargarMedicos() {
    this.cargando = false;
    this.medicoService.cargarMedicos().subscribe((medicos) => {
      console.log(medicos);
      this.medicos = medicos;
      this.totalMedicos = medicos.length;
      this.cargando = false;
    });
  }

  eliminarMedico(medico: Medico) {
    Swal.fire({
      title: 'Borrar medico?',
      text: `Esta a punto de borrar el médico: ${medico.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar',
    }).then((result) => {
      if (result.value) {
        this.medicoService.eliminarMedicos(medico._id).subscribe((res) => {
          Swal.fire(
            'Eliminado!',
            `El médico  ${medico.nombre} fue eliminado correctamente.`,
            'success'
          );

          this.cargarMedicos();
        });
      }
    });
  }

  abrirModal(medico: Medico) {
    console.log(medico);
    this.modalImagenService.abrirModal('medicos', medico._id, medico.img);
  }

  buscar(filtro: string) {
    if (filtro.length === 0) {
      return this.cargarMedicos();
    }
    this.busquedasService.buscar('medicos', filtro).subscribe((res) => {
      this.medicos = res;
      console.log(res);
    });
  }
}
