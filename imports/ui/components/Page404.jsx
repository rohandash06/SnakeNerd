import React, {Component} from 'react'
import { browserHistory } from 'react-router'

export class Page404 extends Component {
	goToHome() {
		browserHistory.push('/')
	}

	render() {
		return (
			<div className = "component-404" >
				<div className = "centered-404">
					{/*
					<span className = "heading-404"> <i className="spy icon"></i> 404! </span>
					<span className = "not-found-404">PAGE NOT FOUND  <i className="configure icon"></i></span>
					<span className = "redirect-404">
						<button className = "ui positive button" >GO BACK HOME</button>
					</span>
					*/}
					<span className = "message-404" ><i className="spy icon"></i> 404! PAGE NOT FOUND  <i className="configure icon"></i></span>
					<span className = "redirect-404">
						<button className = "ui positive button" onClick = {this.goToHome.bind(this)} >GO BACK HOME</button>
					</span>
				</div>
			</div>
		)
	}	
}

