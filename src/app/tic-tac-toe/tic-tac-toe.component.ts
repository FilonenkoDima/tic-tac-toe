import { Component, inject, signal } from '@angular/core';
import { NewGameDialogComponent } from '../new-game-dialog/new-game-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { GameService } from '../services/game.service';
import { BoardComponent } from '../board/board.component';

@Component({
  selector: 'app-tic-tac-toe',
  imports: [
    NgForOf,
    MatButton,
    BoardComponent,
    NgIf,
    NgClass
  ],
  templateUrl: './tic-tac-toe.component.html',
  styleUrl: './tic-tac-toe.component.css'
})
export class TicTacToeComponent {
  player1 = signal('');
  player2 = signal('');
  board!: string[][];
  currentPlayer!: string;
  winner!: string;
  draw!: boolean;
  player1Score!: number;
  player2Score!: number;
  ties = signal(0);

  protected gameService: GameService = inject(GameService);

  constructor(public dialog: MatDialog) {
    this.newGame();
  }

  newGame() {
    const dialogRef = this.dialog.open(NewGameDialogComponent, {
      data: {
        player1: this.player1(),
        player2: this.player2()
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.player1.set(result.player1);
        this.player2.set(result.player2);
        this.gameService.newGame()
      }
    });
  }

  resetGame(){
    this.gameService.newGame()
  }
}
