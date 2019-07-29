import React, {Component} from 'react'
import {ReactiveDict} from 'meteor/reactive-dict'
import {Session} from 'meteor/session'
import TrackerReact from 'meteor/ultimatejs:tracker-react';

export class MyComponentRD extends TrackerReact(Component) {
	constructor() {
		super();

		this.RD_Test = new ReactiveDict();
		this.RD_Test.set("test",1);

		Session.set("test", 1);
	}

	incSes() {
		console.log("Before : ",Session.get("test"));
		let i = Session.get("test"); i++;
		Session.set("test", i);
		console.log("After : ",Session.get("test"));
	}

	incrementRDTest() {
		console.log("Before : ",this.RD_Test.get("test"));

		let rdtest = this.RD_Test.get("test");
		rdtest++;
		this.RD_Test.set("test",rdtest);

		console.log("After : ",this.RD_Test.get("test"));
	}

	render() {
		return (
			<div>
				<h1>{this.RD_Test.get("test")}</h1>
				<h1>{Session.get("test")}</h1>
				<button className = "" onClick = {this.incrementRDTest.bind(this)}>RD_Test +</button>
				<button className = "" onClick = {this.incSes}>Inc Ses + </button>
			</div>
		);
	}
}