import { computed, Injectable, Signal, signal, WritableSignal } from '@angular/core';

enum PlayerSymbol {
  X = 'X',
  O = 'O'
}

export type Square = { id: number, state: PlayerSymbol | null };
export type Board = Square[];
type ActivePlayer = PlayerSymbol;

const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Рядки
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Колонки
  [0, 4, 8], [2, 4, 6]             // Діагоналі
];

@Injectable({
  providedIn: 'root'
})
export class GameService {
  // Сигнал для ігрового поля
  $board: WritableSignal<Board> = signal(this.createBoard());
  $player1Score: WritableSignal<number> = signal(0);
  $player2Score: WritableSignal<number> = signal(0);
  $drawScore: WritableSignal<number> = signal(0);
  $activePlayer: WritableSignal<ActivePlayer> = signal(PlayerSymbol.X);
  readonly $draw: Signal<boolean> = computed(() => this._$draw());
  readonly $winner: Signal<boolean> = computed(() => this._$winner());
  readonly gameOver: Signal<boolean> = computed(() =>
    this._turnCount() >= 8 || this._isGameOver()
  );

  private _turnCount: WritableSignal<number> = signal<number>(0);
  private _lastWinner: WritableSignal<ActivePlayer> = signal<ActivePlayer>(PlayerSymbol.X);
  private _isGameOver: WritableSignal<boolean> = signal<boolean>(false);
  private _$winner: WritableSignal<boolean> = signal<boolean>(false);
  private _$draw: WritableSignal<boolean> = signal<boolean>(false);

  newGame(): void {
    this.$activePlayer.set(this._lastWinner());
    this._turnCount.set(0);
    this._isGameOver.set(false);
    this._$winner.set(false);
    this._$draw.set(false);
    this.$board.set(this.createBoard());
  }

  changePlayerTurn(squareClicked: Square): void {
    this.updateBoard(squareClicked);

    if (this._isGameOver()) return;

    this.$activePlayer.update(current =>
      current === PlayerSymbol.X ? PlayerSymbol.O : PlayerSymbol.X
    );

    this._turnCount.set(this._turnCount() + 1);

    if (this.checkDraw()) {
      this.handleDraw();
    }
  }

  private updateBoard(squareClicked: Square): void {
    // Оновлюємо поле через імутабельну зміну
    const newBoard = [...this.$board()];
    newBoard[squareClicked.id] = { ...squareClicked, state: this.$activePlayer() };
    this.$board.set(newBoard);

    if (this.isWinner()) {
      this._isGameOver.set(true);
      this._lastWinner.set(this.$activePlayer());
      this._$winner.set(true);
    }
  }

  private isWinner(): boolean {
    for (const line of WINNING_LINES) {
      const [a, b, c] = line;
      const symbol = this.$board()[a].state;

      if (symbol &&
        symbol === this.$board()[b].state &&
        symbol === this.$board()[c].state
      ) {
        this.addScore(symbol);
        return true;
      }
    }
    return false;
  }

  private createBoard(): Board {
    return Array.from({ length: 9 }, (_, i) => ({ id: i, state: null }));
  }

  private checkDraw(): boolean {
    return this.gameOver() && !this.isWinner() || this.isEarlyDraw();
  }

  private isEarlyDraw(): boolean {
    return WINNING_LINES.every(line => {
      const symbols = line.map(idx => this.$board()[idx].state);
      return symbols.includes(PlayerSymbol.X) &&
        symbols.includes(PlayerSymbol.O);
    });
  }

  private addScore(winner: PlayerSymbol): void {
    const scoreMap = {
      [PlayerSymbol.X]: this.$player1Score,
      [PlayerSymbol.O]: this.$player2Score
    };
    scoreMap[winner]?.update(x => x + 1);
  }

  private handleDraw(): void {
    this._isGameOver.set(true);
    this.$drawScore.update(d => d + 1);
    this._$draw.set(true);
    this._$winner.set(false);
  }
}
