import { Component, inject } from '@angular/core';
import { NgForOf } from '@angular/common';
import { SquareComponent } from '../square/square.component';
import { GameService } from '../services/game.service';

@Component({
  selector: 'app-board',
  imports: [
    NgForOf,
    SquareComponent
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent {

  public boardService: GameService = inject(GameService);
  constructor() {
    // this.boardService = new GameService();
  }


}
