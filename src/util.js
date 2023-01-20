export const Status = Object.freeze({
  PreGame: 'preGame',
  InGame: 'inGame',
  EndGame: 'endGame',
});

export const Mark = Object.freeze({
  X: 'X',
  O: 'O',
});

/**
 * evaluateBoard() определяет, закончена ли игра в крестики-нолики, и предоставляет подробную информацию (ничья или победитель)
 * @param {string[][]} board, 2D-массив размером 3x3 с 'X' и 'O' в качестве значений
 * @param {{[string]: string}} plrIdToPlrMark, карта от plrId до метки игрока
 * @param {Player[]} players, список игроков
 * @returns {
 *  winner?: Player, (the player that won the game if they exist)
 *  tie?: bool, (true if tie, and false if not a tie)
 *  finished: bool, (true if the game is finished, and false if not finished)
 * }
 */
export const evaluateBoard = (board, plrIdToPlrMark, players) => {
  /**
   * ЗАДАЧА: проверьте наличие победителя (подсказка: убедитесь, что отметка не равна нулю)
   * - проверьте строки
   * - проверьте столбцы
   * - проверьте диагонали
   */
  for(let i=0; i<3;i++){
    //проверка строк
    const mark=board[i][0];
    const isSame =board[i][1] ===mark && board[i][2] === mark;

    if(mark != null && isSame){
      const winner =players.find(player => plrIdToPlrMark[player.id] === mark);
      return{
        finished:true,
        winner
      };
    }
  }
  for(let i=0; i<3;i++){
    //проверка   столбцов
    const mark=board[0][i];
    const isSame =board[1][i] ===mark && board[2][i] === mark;

    if(mark != null && isSame){
      const winner =players.find(player => plrIdToPlrMark[player.id] === mark);
      return{
        finished:true,
        winner
      };
    }
  }

  const mark=board[1][1];
  //проверка диагоналей
  const isSameDiagl = board[0][0] === board[1][1] && board[1][1] === board[2][2];
  if(mark!= null && isSameDiagl){
    const winner =players.find(player => plrIdToPlrMark[player.id] === mark);
      return{
        finished:true,
        winner
      };
  }
  //проверка диагоналей
  const isSameDiagl2 = board[2][0] === board[1][1] && board[1][1] === board[0][2];
  if(mark!= null && isSameDiagl2){
    const winner =players.find(player => plrIdToPlrMark[player.id] === mark);
      return{
        finished:true,
        winner
      };
  }

  //ничья когда доска полность заполнена
  const isTie=board.every((row)=>row.every((mark) =>mark != null))
  if (isTie){
    return{ finished: true, tie:isTie};
  }

  //возврат по умолчанию не завершен
  return{finished: false }

};
