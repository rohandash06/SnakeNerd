import {Meteor} from 'meteor/meteor'
import {Mongo} from 'meteor/mongo'
import {SimpleSchema} from 'meteor/aldeed:simple-schema'

export const cQA = new Mongo.Collection('QA');

cQA.allow({
	insert: function() {
		return true;
	}
});

oAnswer = new SimpleSchema({
	strLabel : {
		type : String,
		label : "Option",
		max: 1
	},
	strValue : {
		type : String,
		label : "Value"
	},
	boolIsCorrect : {
		type : Boolean,
		label : "Is Correct Answer ? "
	}
});

oQASchema = new SimpleSchema({
	strQuestion : {
		type : String,
		label : "Question"/*,
		autoform : {
			rows: 2, 
			cols: 50
		}*/
	},
	strDifficulty : {
		type : String,
		label : "Difficulty",
		allowedValues : ['easy', 'intermediate', 'advanced', 'expert'] /*,
		autoform : {
			options: [
				{label: "Easy", value :"easy"},
				{label: "Intermediate", value :"intermediate"},
				{label: "Advanced", value :"advanced"},
				{label: "Expert", value :"expert"}
			]
		}*/
	},
	arrCategories : {
		type : [String],
		label : "Categories",
		allowedValues : ['mathamatics', 'physics', 'puzzle', 'any']/*,
		autoform : {
			options: [
				{label: "Mathamatics", value :"mathamatics"},
				{label: "Physics", value :"physics"},
				{label: "Puzzle", value :"puzzle"},
				{label: "Any", value :"any"}
			]
		}
		*/
	},
	arrAnswers : {
		type : [oAnswer],
		label : "Answers"
	},
	strSolutionExplaination : {
		type : String,
		label : "Solution Explaination",
		optional : true/*,
		autoform : {
			rows: 10,
			cols: 50
		}*/
	},
	// strAuthor : {
	// 	type : String,
	// 	label : "Author",
	// 	autoValue: function() {
	// 		return this.userId
	// 	}
	// },
	createdAt : {
		type: Date,
		label: "Created At",
		autoValue: function() {
			return new Date();
		}/*,
		autoform:{
			type: "hidden"
		}*/
	}
});


//Attach Schema to Collection
cQA.attachSchema(oQASchema);