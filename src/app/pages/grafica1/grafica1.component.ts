import { Component, OnInit } from '@angular/core';
import { MultiDataSet } from 'ng2-charts';



@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [
  ]
})
export class Grafica1Component {
  titulo1 = 'Venta 1';
  labels1 = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
  data1: MultiDataSet = [
    [350, 450, 100],
  ];

}
