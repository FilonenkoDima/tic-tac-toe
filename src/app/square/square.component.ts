import { Component, inject, input, InputSignal } from '@angular/core';

import { GameService, Square } from '../services/game.service';

@Component({
  selector: 'app-square',
  imports: [],
  template: `
  <div class="game-square border" (click)="changePlayer()">
    <p class="text-grey-darker"> {{ square().state }} </p>
  </div>
`,
  styles: `
    .game-square {
      height: 8rem;
      width: 8rem;
      text-align: center;
      line-height: 0.85;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: lightcoral;
    }

    p {
      display: inline-block;
      font-size: 8rem;
      margin: 0;
    }
  `
})
export class SquareComponent {
  private readonly gameService: GameService = inject(GameService);

  square: InputSignal<Square> = input.required<Square>();

  changePlayer() {
    if (!this.square().state) {
      this.square().state = this.gameService.$activePlayer();
      this.gameService.changePlayerTurn(this.square());
    }
  }
}
