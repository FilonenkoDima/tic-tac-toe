import { Component, input, Input } from '@angular/core';
import { GameService } from '../services/game.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-square',
  imports: [
    NgClass
  ],
  templateUrl: './square.component.html',
  styleUrl: './square.component.css'
})
export class SquareComponent {

  square = input.required<{ id: number, state: string | null }>();

  constructor( public gameService: GameService) { }

  ngOnInit() {
  }

  changePlayer(){

    this.gameService.isGameRunning = true;

    if ( this.gameService.isGameRunning && this.square().state === null ){
      this.square().state =  this.gameService!.activePlayer!;
      this.gameService.changePlayerTurn( this.square());
    }

  }
}
