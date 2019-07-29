import {Meteor} from 'meteor/meteor' 
import {cQA} from '/imports/api/collections/QA/QA'

console.log("Here");

Meteor.publish('QA',function() {
	console.log("Publishing QA");
	return cQA.find();
});

console.log("Here1");