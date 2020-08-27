import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HospitalService } from 'src/app/services/hospital.service';
import { MedicoService } from 'src/app/services/medico.service';
import { Hospital } from 'src/app/models/hospital.model';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { Medico } from 'src/app/models/medico.model';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styleUrls: ['./medico.component.css'],
})
export class MedicoComponent implements OnInit {
  public medicoForm: FormGroup;
  public hospitales: Hospital[] = [];

  public hospitalSeleccionado: Hospital;
  public medicoSeleccionado: Medico;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private hospitalService: HospitalService,
    private medicoService: MedicoService,
    private modalImagenService: ModalImagenService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ id }) => this.cargarMedico(id));

    this.cargarHospitales();
    this.medicoForm = this.fb.group({
      nombre: ['', Validators.required],
      hospital: ['', Validators.required],
    });

    this.medicoForm.get('hospital').valueChanges.subscribe((hospitalId) => {
      this.hospitalSeleccionado = this.hospitales.find(
        (hospital) => hospital._id === hospitalId
      );
    });
  }

  cargarMedico(id: string) {
    if (id === 'nuevo') {
      return;
    }
    console.log(id);

    this.medicoService
      .getMedicoById(id)
      .pipe(delay(200))
      .subscribe((medico) => {
        if (!medico) {
          return this.router.navigateByUrl(`/dashboard/medicos`);
        }

        const {
          nombre,
          hospital: { _id },
        } = medico;

        this.medicoForm.setValue({ nombre, hospital: _id });
        this.medicoSeleccionado = medico;
      });
  }
  cargarHospitales() {
    this.hospitalService
      .cargarHospitales()
      .subscribe((hospitales: Hospital[]) => (this.hospitales = hospitales));
  }

  guardarMedico() {
    if (this.medicoSeleccionado) {
      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id,
      };
      this.medicoService
        .modificarMedicos(data)
        .subscribe((res) =>
          Swal.fire(
            'Modificado',
            `El médico ${data.nombre} ha sido modificado.`,
            'success'
          )
        );
    } else {
      const { nombre } = this.medicoForm.value;
      this.medicoService
        .crearMedico(this.medicoForm.value)
        .subscribe((res: any) => {
          Swal.fire('Creado', `El médico ${nombre} ha sido creado.`, 'success');
          this.router.navigateByUrl(`/dashboard/medico/${res.medico._id}`);
        });
    }
  }

  abrirModal(medico: Medico) {
    this.modalImagenService.abrirModal('medicos', medico._id, medico.img);
  }
}
