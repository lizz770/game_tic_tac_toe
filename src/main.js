import { Status, Mark, evaluateBoard } from './util';

function onRoomStart() {
  /**
   * ЗАДАЧА: определите поля:
   * 
   * state.status (hint: use Status enum)
   * state.plrIdToPlrMark
   * state.plrMoveIndex
   * state.board
   * state.winner
   */
  const state = {
    status:Status.PreGame,
    //доска
    board:[
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ],
    plrMoveIndex:0,
    plrIdToPlrMark:{}, //[plrId]:Mark.X
    winner:null,
  };
  return { state };
}

function onPlayerJoin(player, roomState) {
  const { players, state } = roomState;
  if (players.length === 2) { // достаточно игроков, чтобы играть в эту игру
    //измените состояние, чтобы начать игру
    state.status=Status.InGame;
    state.plrIdToPlrMark={
      [players[0].id]:Mark.X,//первый игрок крестик второй нолик
      [players[1].id]:Mark.O
    }

    return {
      //скажите вашей очереди, чтобы она больше не допускала игроков в эту комнату
      state,
      joinable:false,
    };
  }

  // все еще ждем другого игрока, поэтому не вносите никаких изменений
  return {};
}

function onPlayerMove(player, move, roomState) {
  const { state, players, logger } = roomState;
  const { plrMoveIndex, plrIdToPlrMark } = state;
  const { x, y } = move;

  // проверить ход игрока и выдать разумные сообщения об ошибках
  if(state.status !== Status.InGame){
    throw new Error('Игра не ведется, вы не можете сделать ход!')
  }
  if (players[plrMoveIndex].id !== player.id){
    throw new Error('Эй, сейчас не твоя очередь!')
  }
  if (state.board[x][y] !== null){
    throw new Error('Кто-то уже отметил эту клетку!')

  }
  // что делать, если игрок попытается сделать ход, когда игра еще не началась?
  // что делать, если игрок делает ход, а сейчас не его очередь?
  // что делать, если игрок делает ход на доске, где уже была отметка?
  
  //установка доски
  state.board[x][y] = plrIdToPlrMark[player.id]

  // проверьте, закончена ли игра
  const result = evaluateBoard(state.board, plrIdToPlrMark, players);
  if (result?.finished) {
    state.status = Status.EndGame;
    // обрабатывать различные случаи, когда игра завершена, используя значения, вычисленные из

    if(result.winner != null){
      state.winner =result.winner;
    }
    return {
      state,
      finished:true,
      // ЧТО НУЖНО СДЕЛАТЬ: включить изменения состояния, чтобы включить обновление состояния
      // ЧТО ДЕЛАТЬ: сообщите вашей очереди, что комната закончена, что позволит вам правильно отобразить комнату
    };
  }

  //Установите plr для перехода к следующему игроку (подсказка: обновить state.plrMoveIndex)
  state.plrMoveIndex =(plrMoveIndex + 1) % 2;
  return { state };
}

function onPlayerQuit(player, roomState) {
  const { state, players } = roomState;

  state.status = Status.EndGame;
  if (players.length === 1) {
    // когда игрок уходит и появляется другой игрок, мы должны по умолчанию назначить победителя
    // быть оставшимся игроком
    const [winner] = players;
    state.winner = winner;
    return {
      //скажите, что ваша очередь в комнате окончена
      state,
      finished:true,
    };
  }
  return {
    // когда игрок уходит, а другого игрока не было, победителя нет
    // правильно скажи, что твоя очередь, комната окончена
    state,
    finished:true,
    joinable:false,
  };
}

//функция комнаты
export default {
  onRoomStart,
  onPlayerJoin,
  onPlayerMove,
  onPlayerQuit,
};
