import { Component, computed, effect, inject, Signal, signal, WritableSignal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

import { GameService } from '../services/game.service';
import { BoardComponent } from '../board/board.component';
import { NewGameDialogComponent } from '../modals/new-game-dialog/new-game-dialog.component';
import { CongratulationDialogComponent } from '../modals/congratulation-dialog/congratulation-dialog.component';
import { DrawDialogComponent } from '../modals/draw-dialog/draw-dialog.component';

@Component({
  selector: 'app-tic-tac-toe',
  imports: [BoardComponent, MatFabButton, MatIcon],
  templateUrl: './tic-tac-toe.component.html',
})
export class TicTacToeComponent {
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly gameService: GameService = inject(GameService);

  $player1Name: WritableSignal<string> = signal('');
  $player2Name: WritableSignal<string> = signal('');
  $activePlayer: WritableSignal<string> = this.gameService.$activePlayer;
  $player1Score: WritableSignal<number> = this.gameService.$player1Score;
  $player2Score: WritableSignal<number> = this.gameService.$player2Score;
  $drawScore: WritableSignal<number> = this.gameService.$drawScore;
  $gameOver: Signal<boolean> = this.gameService.gameOver;
  $tiesScore: Signal<number> = computed(() => this.$player1Score() + this.$player2Score() + this.$drawScore());

  constructor() {
    this.newGame();
    // ти казав, що поки що не варто використовувати effect, але він тут ідеально підходить для сигналів. Можна якось обійтись без нього і використовувати сигнали?
    effect(() => {
      if (this.gameService.$winner()) {
        this.showCongratulationsDialog();
      }
      if (this.gameService.$draw()) {
        this.showDrawDialog();
      }
    });
  }

  resetGame() {
    this.gameService.newGame();
  }

  newGame() {
    this.showNewGameDialog();
  }

  private showNewGameDialog() {
    const dialogRef = this.dialog.open(NewGameDialogComponent, {
      data: {
        player1: this.$player1Name(),
        player2: this.$player2Name()
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.$player1Name.set(result.player1);
        this.$player2Name.set(result.player2);
        this.gameService.newGame()
      }
    });
  }

  private showDrawDialog(): void {
    const dialogRef = this.dialog.open(DrawDialogComponent, {
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(() => {
      this.resetGame();
    });
  }

  private showCongratulationsDialog(): void {
    const dialogRef = this.dialog.open(CongratulationDialogComponent, {
      data: { playerName: this.gameService.$activePlayer() },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(() => {
      this.resetGame();
    });
  }
}
