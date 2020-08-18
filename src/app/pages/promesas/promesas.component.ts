import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styleUrls: ['./promesas.component.css'],
})
export class PromesasComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    // const promesa = new Promise((resolve, reject) => {
    //   if (false) {
    //     resolve('hola Mundo');
    //   } else {
    //     reject('algo ssalio mal');
    //   }
    // });
    // promesa
    //   .then((res) => console.log(`Termineeee ${res}`))
    //   .catch((error) => console.log('error: ', error));
    // console.log('Fin del init');

    this.getUsuarios().then((usuarios) => console.log(usuarios));
  }

  getUsuarios() {
    return new Promise((resolve) => {
      fetch('https://reqres.in/api/users')
        .then((resp) => resp.json())
        .then((body) => body.data);
    });
  }
}
