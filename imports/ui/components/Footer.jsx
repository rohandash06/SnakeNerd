import {Meteor} from 'meteor/meteor' 
import React, {Component} from 'react'

export class Footer extends Component {
	constructor() {
		super()
	}

	currYear() {
		let date = new Date();
		return date.getFullYear();
	}

	render() {
		return (
			<div className = "footer-component">
				<hr className = "title-underline"/>
				<div className = "ui two column centered grid">
					<div className = "sixteen wide column">
						<p className = "center copyright-text">Nerd Snake <i className="copyright icon"></i> {this.currYear()}. Made with <i className="heart icon color-red"></i> by Aman Minhas</p>
					</div>
				</div>
			</div>
		)
	}
}
