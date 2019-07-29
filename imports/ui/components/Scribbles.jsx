import {Meteor} from 'meteor/meteor' 
import React, {Component} from 'react'
import {Link} from 'react-router'
import {ReactiveDict} from 'meteor/reactive-dict'
import {cQA} from '/imports/api/collections/QA/QA'
import { Session } from 'meteor/session'

import TrackerReact from 'meteor/ultimatejs:tracker-react';

// import {SetupFormModal} from './SetupFormModal'
import {SetupForm} from './SetupForm'
import {GameInstructions} from './GameInstructions'

// import './GameInstructions'

export class Scribbles extends TrackerReact(Component) {
	constructor() {
		super()

		Session.setDefault("strDifficulty","easy");
		Session.setDefault("strCategory","mathamatics");
	}

	// componentDidMount() {
	componentWillMount() {
		this.initThis();
	}

	initThis() {
		console.log("here");
		$('.setup-form-modal').modal({
			onApprove : function() {
				let strCategory = $("#setup-form-category option:selected").val();
				Session.set("strCategory",strCategory);
				
				let strDifficulty = $(".setup-form input:radio[name=setup-form-difficulty]:checked").val();
				Session.set("strDifficulty",strDifficulty);	
			}
		}).modal('show');

	}

	render() {
		return (
			<div>
				{/*<!-- Start Setup Form Modal -->*/}
				<div className = "ui modal setup-form-modal">
			        <div className = "header font25"> Game Settings </div>
			        <div className = "content">
			        	<SetupForm/>
			        </div>
			        <div className = "actions">
			            <div className = "ui positive right tabled icon button .approve">
			                Done <i className = "checkmark icon"></i>
			            </div>
			        </div>
			    </div>
				{/*<!-- End Setup Form Modal -->*/}
			</div>
		)
	}
}
