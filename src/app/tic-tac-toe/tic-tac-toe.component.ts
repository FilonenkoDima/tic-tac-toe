import { Component, computed, inject, Signal, signal, WritableSignal } from '@angular/core';
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
  private readonly dialog: MatDialog = inject(MatDialog);

  protected readonly gameService: GameService = inject(GameService);

  player1Name: WritableSignal<string> = signal('');
  player2Name: WritableSignal<string> = signal('');
  activePlayer: WritableSignal<string> = this.gameService.activePlayer;
  player1Score: WritableSignal<number> = this.gameService.player1Score;
  player2Score: WritableSignal<number> = this.gameService.player2Score;
  drawScore: WritableSignal<number> = this.gameService.drawScore;
  tiesScore: Signal<number> = computed(() => this.player1Score() + this.player2Score() + this.drawScore());

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
        player1: this.player1Name(),
        player2: this.player2Name()
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.player1Name.set(result.player1);
        this.player2Name.set(result.player2);
        this.gameService.newGame()
      }
    });
  }

  resetGame() {
    this.gameService.newGame();
  }

  showCongratulationsDialog(): void {
    this.dialog.open(CongratulationDialogComponent, {
      data: { playerName: this.gameService.activePlayer() },
      disableClose: true
    });
  }
}
