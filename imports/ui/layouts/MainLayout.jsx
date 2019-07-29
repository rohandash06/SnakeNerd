import React, {Component} from 'react'
import {Link} from 'react-router'

import {ContactInformation} from '/imports/ui/components/ContactInformation'
import {Footer} from '/imports/ui/components/Footer'
import {LoaderComponent} from '/imports/ui/components/LoaderComponent'
import {Navigation} from '/imports/ui/components/Navigation'
import {WhyNerdSnake} from '/imports/ui/components/WhyNerdSnake'

export class MainLayout extends Component {
	render() {
		return (
			<div className = "admin-main-layout-div">
				{/*
				<h2 className="ui icon header">
				<i className="settings icon"></i>
				<div className="content">
				Account Settings
				<div className="sub header">Manage your account settings and set e-mail preferences.</div>
				</div>
				</h2>
				<h1>This is MainLayout</h1>
				*/}
				<LoaderComponent />
				<Navigation />
				{ this.props.children }	
				<WhyNerdSnake />
				<ContactInformation />
				<Footer />
			</div>
		)
	}
}

//As of right now, I don't understand this, but I will research later
MainLayout.propType = {
	children: React.PropTypes.element.isRequired
}

//Why is this not possible, research about that too.
// export AdminMainLayout;
