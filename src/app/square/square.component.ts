import { Component, inject, input } from '@angular/core';

import { GameService } from '../services/game.service';

@Component({
  selector: 'app-square',
  imports: [],
  templateUrl: './square.component.html',
  styleUrl: './square.component.css'
})
export class SquareComponent {
  square = input.required<{ id: number, state: string | null }>();

  public readonly gameService: GameService = inject(GameService);

  changePlayer(){
    if (!this.square().state){
      this.square().state = this.gameService.activePlayer;
      this.gameService.changePlayerTurn( this.square());
    }
  }
}
