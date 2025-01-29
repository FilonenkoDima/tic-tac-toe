import { Component } from '@angular/core';
import { TicTacToeComponent } from './tic-tac-toe/tic-tac-toe.component';

@Component({
  selector: 'app-root',
  imports: [TicTacToeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
}
