import React, {Component} from 'react'
import {Link} from 'react-router'

export class Navigation extends Component {
	render() {
		return (
			<div className="ui large menu inverted nerd-snake-navbar mb0">
				{/*<!-- <a className="active item">Home</a> -->*/}
				<div className="item logo-item">
					<a href = "/" ><img src = "/img/snake-icon.png"/></a>
				</div>
				<div className="right menu">
					<div className="item">
						{/*<!-- <div className="ui primary button">Sign Up</div> -->*/}
						<a href = "https://www.facebook.com/nerdsnake/" target = "_blank" >
							<button className="ui facebook button"> <i className="facebook icon"></i> Nerd Snake </button>
						</a>
					</div>
				</div>
			</div>
		)
	}
}
