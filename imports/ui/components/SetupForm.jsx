import React, {Component} from 'react'
import { Session } from 'meteor/session'

export class SetupForm extends Component{
	
	constructor() {
		super() 
	}

	componentDidMount() {
		$('select.dropdown').dropdown();

		//Initialize category
		$("#setup-form-category").val(Session.get("strCategory")).change();
		//Initialize difficulty
		$('input:radio[name="setup-form-difficulty"]').filter('[value="'+Session.get("strDifficulty")+'"]').prop("checked",true);
	}

	render() {
		return (
			<div className="ui form setup-form">

				<div className="field">
					<label>Category</label>
					<select id = "setup-form-category" className="ui fluid selection dropdown" > 
						<option value="mathamatics">Mathematics</option>
						{/*<option value="physics">Physics</option>*/}
					</select>
				</div>

				<div className="grouped fields">
					<label>Difficulty</label>
					<div className="field">
						<div className="ui slider checkbox">
							<input type="radio" name="setup-form-difficulty" value = "easy" />
							<label>Easy</label>
						</div>
					</div>
					<div className="field">
						<div className="ui slider checkbox">
							<input type="radio" name="setup-form-difficulty" value = "intermediate" />
							<label>Intermediate</label>
						</div>
					</div>
					<div className="field">
						<div className="ui slider checkbox">
							<input type="radio" name="setup-form-difficulty" value = "advanced" />
							<label>Advanced</label>
						</div>
					</div>
					{/*
					<div className="field">
						<div className="ui slider checkbox">
							<input type="radio" name="setup-form-difficulty" value = "expert" />
							<label>Expert</label>
						</div>
					</div>
					*/}
				</div>
			</div>
		)
	}
}