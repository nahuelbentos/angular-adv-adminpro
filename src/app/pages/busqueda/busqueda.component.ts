import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouteReuseStrategy, Router } from '@angular/router';
import { BusquedasService } from '../../services/busquedas.service';
import { Usuario } from '../../models/usuario.model';
import { Medico } from '../../models/medico.model';
import { Hospital } from '../../models/hospital.model';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styleUrls: ['./busqueda.component.css'],
})
export class BusquedaComponent implements OnInit {
  usuarios: Usuario[] = [];
  medicos: Medico[] = [];
  hospitales: Hospital[] = [];
  constructor(
    private activatedRoute: ActivatedRoute,
    private busquedasService: BusquedasService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ filtro }) => {
      console.log(filtro);
      this.busquedaGlobal(filtro);
    });
  }

  busquedaGlobal(filtro: string) {
    this.busquedasService.busquedaGlobal(filtro).subscribe((res: any) => {
      console.log(res);
      this.usuarios = res.usuarios;
      this.medicos = res.medicos;
      this.hospitales = res.hospitales;
    });
  }
  abrirMedico(medico: Medico) {
    console.log(medico);
    this.router.navigateByUrl(`/dashboard/medico/${medico._id}`);
  }
}
