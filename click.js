class Click{
    static clicked_square(r, f, game=0){
        console.log("square clicked : id ", r, f)
        games[game].config.BOARD.ui_board[r][f].clicked_square()
        games[game].config.BOARD.clicked_board()
        return
    }

    static clicked_board(){
        console.log("board clicked")
        return
    }
}