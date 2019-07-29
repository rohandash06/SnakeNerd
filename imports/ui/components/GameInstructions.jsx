import React, {Component} from 'react'

export class GameInstructions extends Component{
	render() {
		return (
			<div className = "game-instructions-div">
				<ul>
					<li>
						Control the snake on the white board using the arrow keys <i className="arrow down icon"></i> <i className="arrow left icon"></i> <i className="arrow right icon"></i> <i className="arrow up icon"></i> on your keyboard.
					</li>
					<li>
						Questions will appear on the page with maximum 4 options A, B, C and D. These option will also appear on the board as food for snake. You need to solve the question and make the snake eat the correct answer.
					</li>
					<li>
						Game ends when you eat the wrong answer, hit the border or bite yourself.
					</li>
					<li>
						Good Luck!
					</li>

				</ul>
			</div>
		);
	}
}
