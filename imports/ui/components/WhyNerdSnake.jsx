import {Meteor} from 'meteor/meteor' 
import React, {Component} from 'react'

export class WhyNerdSnake extends Component {
	render() {
		return (
			<div className = "why-nerdsnake-component">
				<h3 className = "why-nerdsnake-heading mt30 center">Why Nerd Snake?</h3>
				<hr className = "title-underline"/>

				<div className = "ui two column centered grid mt30 mb30 center">
					<div className = "twelve wide mobile eight wide computer column padtop0">
						<div className = "why-nerdsnake-container">
							<div className = "why-nerdsnake-content">
								<p>In this day and age dominated by calculators, Nerd Snake is a game that challenges you to exercise your brain and make it perform tasks that it is in truth capable of. It is a good way to exercise your brain and is truly excellent for a developing brain.</p> 
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
	