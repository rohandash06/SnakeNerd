import React, {Component} from 'react'
import { Session } from 'meteor/session'

import {SetupForm} from './SetupForm'

export class SetupFormModal extends Component{

	constructor() {
		super()
	}

	componentDidMount() {
		$('.setup-form-modal').modal({
			onApprove : function() {
				var strCategory = $("#setup-form-category option:selected").val();
				Session.set("strCategory",strCategory);
				
				var strDifficulty = $(".setup-form input:radio[name=setup-form-difficulty]:checked").val();
				Session.set("strDifficulty",strDifficulty);
				
			}
		}).modal('show');
	}

	render() {
		/*<!-- Start Setup Form Modal -->*/
		return (
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
		)
		/*<!-- End Setup Form Modal -->*/
	}
}