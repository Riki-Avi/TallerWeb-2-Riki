import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('dados');

  dadoIzquierdo: string = 'dice1.png';
  dadoDerecho: string = 'dice2.png';

  numero1: number = 1;
  numero2: number = 2;

  resultado = '';

  lanzarDados() {
    this.numero1 = Math.floor(Math.random() * 6) + 1;
    this.numero2 = Math.floor(Math.random() * 6) + 1;

    this.dadoIzquierdo = 'dice' + this.numero1 + '.png';
    this.dadoDerecho = 'dice' + this.numero2 + '.png';

    if (this.numero1 == this.numero2) {
      this.resultado = 'GANASTE';
    } else {
      this.resultado = 'PERDISTE';
    }
  }
}
