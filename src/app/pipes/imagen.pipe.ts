import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'imagen',
})
export class ImagenPipe implements PipeTransform {
  transform(img: string, tipo: 'usuarios' | 'medicos' | 'hospitales'): string {
    if (!img) {
      return `${environment.baseUrl}/upload/${tipo}/no-image`;
    } else if (img.includes('https')) {
      return img;
    } else {
      return `${environment.baseUrl}/upload/${tipo}/${img}`;
    }
  }
}
