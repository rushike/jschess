const redox = './images/redo_icon.svg'

const undox = './images/undo_icon.svg'

const blank = './images/blank.svg'

var config = {
		/**
		 * Constants
		 */
        WHITE :     '#f8ecec', // hex colo string
        BLACK :     '#ffa500', // hex colo string
        HIGHLIGHT : '#646400', // hex colo string
        CONTROLLER : {
                redo : redox,
                undo : undox,
                blank : blank
        },
        SQ_SIZE: 10, // value in pixels
        BOARD : null,


		/**
		 * Functions
		 * most of them are seters
		 */

		/**
		 * It set square size in pixels by reading viewport height and width
		 * and height and width of div enclosing board.
		 * For mobile devices board spans over complete width by default, else till only div width
		 * @param {Number | dictonary} px 
		 */
		set_sq_size : function(px = null){
			if(typeof px == Number){
				console.log("Number got : ", typeof px)
				config.SQ_SIZE = px
			}
			else if(px.constructor == Object){
				if(px.id && typeof px.id == 'string'){
					var h = get.divheight(px.id),
					w = get.divwidth(px.id)
					H = get.bodyheight()
					W = get.bodywidth()
					l =  h > w ? parseInt(W / 8) : parseInt(h / 8)
					config.SQ_SIZE = l
				}
			}
		},

		/**
		 * set black and white color of board
		 * takes colors dictionart of format : 
		 * {
		 * 		black : "..." // hex color string with #
		 *      white : "..." // hex color string with #
		 * }
		 * @param {dictionary} colors 
		 */
		set_black_white : function(colors){
			if(colors.constructor == Object){
				if(colors.black && colors.white &&
					typeof colors.black == 'string' && typeof colors.black == 'string' &&
					match.iscolor(colors.black) && match.iscolor(colors.white)){
						config.BLACK = colors.black
						config.WHITE = colors.white
				}
			}
		}
};

