import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  // la barra con los enlaces se mudo al panel, por eso app solo necesita el router-outlet
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
}
