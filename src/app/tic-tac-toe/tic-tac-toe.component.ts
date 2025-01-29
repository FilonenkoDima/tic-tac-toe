import { Component, inject, signal, WritableSignal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatFabButton } from '@angular/material/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIcon } from '@angular/material/icon';

import { GameService } from '../services/game.service';
import { BoardComponent } from '../board/board.component';
import { NewGameDialogComponent } from '../new-game-dialog/new-game-dialog.component';
import { CongratulationDialogComponent } from '../congratulation-dialog/congratulation-dialog.component';

@Component({
  selector: 'app-tic-tac-toe',
  imports: [BoardComponent, MatFabButton, MatIcon],
  templateUrl: './tic-tac-toe.component.html',
  styleUrl: './tic-tac-toe.component.css'
})
export class TicTacToeComponent {
  player1: WritableSignal<string> = signal('');
  player2: WritableSignal<string> = signal('');

  ties: WritableSignal<number> = signal(0);

  protected readonly gameService: GameService = inject(GameService);
  private readonly dialog: MatDialog = inject(MatDialog);

  constructor() {
    this.newGame();
    this.gameService.winner$.pipe(takeUntilDestroyed()).subscribe((hasWinner) => {
      if (hasWinner) {
        this.showCongratulationsDialog();
        this.resetGame();
      }
    });
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

  resetGame() {
    this.gameService.newGame()
  }

  showCongratulationsDialog(): void {
    this.dialog.open(CongratulationDialogComponent, {
      data: { playerName: this.gameService.activePlayer },
      disableClose: true
    });
  }
}
