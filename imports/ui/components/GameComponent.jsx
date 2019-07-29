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

screenIsMobile = () => {
	// if (window.width < 1000) return true;
	if ($(window).width() < 1000) return true;

	return false;
}

gameComponentLoaded = () => {
	// console.log("I Loaded");
}

export class GameComponent extends TrackerReact(Component) {
	
	constructor() {
		super()

		$("body").on("load",function(){
			console.log("Body Loaded");
		});

		this.setSessionVariables();

		this.oSettings = {
			numBoardSize : 400,
			numBoxSize : 10
		}

		this.RD_Snake = new ReactiveDict();
		this.RD_QASettings = new ReactiveDict();
		this.RD_FoodSettings = new ReactiveDict();
		this.RD_GameData = new ReactiveDict();

		this.arrAskedQuestionIds = [];

		this.CONST_GAME_STATUS_PLAYING = 1;
		this.CONST_GAME_STATUS_PAUSED = 2;

		this.arrGameStatusAllowedValues = [this.CONST_GAME_STATUS_PLAYING, this.CONST_GAME_STATUS_PAUSED];
		this.numGameStatusDefault = this.CONST_GAME_STATUS_PAUSED;

		this.CONST_IS_NOT_FOOD = 0;
		this.CONST_IS_INCORRECT_FOOD = 1;
		this.CONST_IS_CORRECT_FOOD = 2;

		this.CONST_HIT_THE_BORDER = 1;
		this.CONST_BIT_ITSELF = 2;
		this.CONST_ATE_INCORRECT_FOOD = 3;
		this.CONST_GAME_WON = 4;

		this.numGameEndReason = 0 ; // 0 = Game not Ended.

		//Bind methods
		// this.getSnake = this.getSnake.bind(this);
		this.scaleByBoxSize = this.scaleByBoxSize.bind(this);

		/*FIND A WAY TO MOVE THE METHOD BELOW TO componentDidMount */ 
		this.initNewGame();	

	}

	componentDidMount() {
		
		this.openModalToSetSessionVars();

		// this.initNewGame();
		componentInstance = this;
		$('body').on('keydown',function(event){
			// console.log('keypressed ',event.keyCode);

			// console.log("KC ",event.keyCode);
			if($.inArray(event.keyCode, [ 37,38,39,40 ]) !== -1 ) {
				event.preventDefault(); // dont scroll page
				componentInstance.changeDirectionSnake(event.keyCode);
			} else {
				// console.log("I AM HERE ",event.keyCode);
			}

		});
	}

	getGameEndReasonString() {
		switch(this.numGameEndReason) {
			case 0 : 
				return "";
				break;
			case this.CONST_HIT_THE_BORDER : 
				return "Sorry! Crashed into the border.";
				break;
			case this.CONST_BIT_ITSELF : 
				return "Sorry! Your snake bit itself.";
				break;
			case this.CONST_ATE_INCORRECT_FOOD : 
				return "Sorry! Your snake ate a poisonous answer.";
				break;
			case this.CONST_GAME_WON : 
				return "Congratulations! You win! Your snake is mighty nerdy.";
				break;
		}
	}

	openModalToSetSessionVars() {

		// if(window.width > 1000) {
		if(!screenIsMobile()) {
			$('.setup-form-modal').modal({
				onApprove : function() {
					let strCategory = $("#setup-form-category option:selected").val();
					Session.set("strCategory",strCategory);
					
					let strDifficulty = $(".setup-form input:radio[name=setup-form-difficulty]:checked").val();
					Session.set("strDifficulty",strDifficulty);	
				}
			}).modal('show');
		}

	}

	newGameClickEvent() {	
		console.log("I am here");
		this.openModalToSetSessionVars();
		this.initNewGame();
		this.hideDimmer();
	}

	playSnakeClickEvent() {
		
		this.hideDimmer();
		this.showCountdownDimmer()			

		// this.initBoard();

		// if(!this.changeQuestion()) {
		// 	// alert("Congratulations! you win");
		// 	this.gameOver(this.CONST_GAME_WON);
		// } else {
		// 	this.startMoveSnakeInterval();
		// }
	
		
	}

	playSnake() {
		this.initBoard();

		if(!this.changeQuestion()) {
			// alert("Congratulations! you win");
			this.gameOver(this.CONST_GAME_WON);
		} else {
			this.startMoveSnakeInterval();
		}
	}

	pauseSnake() {
		this.stopSnake();
	}

	showInstructions() {
		$('.game-instructions-modal').modal('show');
	}

	/*
	* @desc : Change the Direction of the Snake 
	* @param : Int: numKeyCode. KeyCode is the code of the key pressed by the user.
	*/
	changeDirectionSnake(numKeyCode){
		//console.log("Changing Direction");
		oSnake = this.RD_Snake.get("oSnake");
		strNewHeading = this.getDirectionFromKeyCode(numKeyCode);

		if(strNewHeading) {
			oSnake.strHeading = !this.is_opposite(oSnake.strHeading,strNewHeading) ? this.getDirectionFromKeyCode(numKeyCode) : oSnake.strHeading;
		}
		
		//console.log(snake.strHeading);
	    this.RD_Snake.set("oSnake",oSnake);
	}

	/*
	* @desc : Gets Direction from the KeyCode 
	* @param : Int : numKeyCOde
	* @returns : False | String. False if the key code does not belong to the array keys.
	*/
	getDirectionFromKeyCode(numKeyCode) {
		
		switch(numKeyCode) {
			case 37 :
				return 'left';
			case 38 :
				return 'up';
			case 39 :
				return 'right';
			case 40 :
				return 'down';
			default :
				return false;
		}
	}

	/*
	* @desc : Finds out of the two specified directions are opposite or not
	* @param : String : strDirection1 & strDirection2:
	* @return : Bool. Ture if opposite, else False.
	*/
	is_opposite(strDirection1,strDirection2) {
		switch(strDirection1.toLowerCase()) {
			case 'up' : 
				if(strDirection2.toLowerCase() == 'down') {
					return true;
				} else {
					return false;
				}
				break;
			case 'right' :
				if(strDirection2.toLowerCase() == 'left') {
					return true;
				} else {
					return false;
				}
				break;
			case 'down' :
				if(strDirection2.toLowerCase() == 'up') {
					return true;
				} else {
					return false;
				}
				break;
			case 'left' :
				if(strDirection2.toLowerCase() == 'right') {
					return true;
				} else {
					return false;
				}
				break;
			default :
				return true;
		}
	}


	getSnake() {
		// console.log(this.RD_Snake.get("oSnake"))
		return this.RD_Snake.get("oSnake");
	}

	initNewGame() {

		this.setGameStatus(this.numGameStatusDefault);

		this.initBoard();
	}

	setGameStatus(numGameStatus) {
		if($.inArray(numGameStatus, this.arrGameStatusAllowedValues) !== -1) {
			//If the given status is within the allowed values
			this.RD_GameData.set("numGameStatus", numGameStatus);
		}
	}

	startMoveSnakeInterval() {
		this.setGameStatus(this.CONST_GAME_STATUS_PLAYING);
		this.moveSnakeInterval = setInterval( () => {
			this.moveSnake() ;
		},70); // Snake Speed
		// },100);
	}

	stopSnake() {
		this.setGameStatus(this.CONST_GAME_STATUS_PAUSED);
		clearInterval(this.moveSnakeInterval);
	}

	/*
	* @desc : Gets the New Head location of the Snake based of the current head location and the direction.
	* @param : String: strDirection & JSON: jsonCurrHead (co-ordinates, example : {x:3,y:5}) 
	* @return : JSON : new co-ordinates for the head. example : {x:3,y:6}
	*/
	getNewHead(jsonCurrHead,strDirection) {
		x = 0; y = 0;
		switch(strDirection.toLowerCase()) {
			case 'up':
				x = 0; y = -1;
				break;
			case 'right':
				x = 1; y = 0;
				break;
			case 'down':
				x = 0; y = 1;
				break;
			case 'left':
				x = -1; y = 0;
				break;
		}

		return {x: jsonCurrHead.x + x , y: jsonCurrHead.y + y };
	}

	isBorder(jsonCoordinate) {
		numLowerlimit = 0;
		numUpperLimit = this.oSettings.numBoardSize - this.oSettings.numBoxSize;

		//console.log("jsonCoordinate ", jsonCoordinate);
		/*
		console.log("returns ", jsonCoordinate.x > numUpperLimit || 
			jsonCoordinate.x < numLowerlimit || 
			jsonCoordinate.y > numUpperLimit || 
			jsonCoordinate.y < numLowerlimit);
		*/
		
		return  jsonCoordinate.x > numUpperLimit || 
			jsonCoordinate.x < numLowerlimit || 
			jsonCoordinate.y > numUpperLimit || 
			jsonCoordinate.y < numLowerlimit;
	}

	scaleCoordinateByBoxSize(jsonCoordinate) {
		return ({ 
			x : jsonCoordinate.x * this.oSettings.numBoxSize,
			y : jsonCoordinate.y * this.oSettings.numBoxSize,
		});
	}

	gameOver(numGameOverReason) {
		this.stopSnake();

		this.numGameEndReason = numGameOverReason;

		this.showDimmer();
		/*
		switch(numGameOverReason) {
			case this.CONST_HIT_THE_BORDER : 
				//console.log("Hit the Border");
				break;
			case this.CONST_BIT_ITSELF :
				//console.log("Bit Itself");
				break;
			case this.CONST_ATE_INCORRECT_FOOD :
				//console.log("Ate Incorrect Food");
				break;
			case this.CONST_GAME_WON :
				//console.log("Won the game.");
				break;
			default :
				//console.log("Unknown Reason");
				break;
		}
		*/
	}

	showDimmer() {
		// $('.game-qa-area').dimmer('show');
		// $('.game-strip').dimmer('show');
		$('.final-result-dimmer').dimmer('show');
	}

	hideDimmer() {
		// $('.game-strip').dimmer('hide');
		$('.final-result-dimmer').dimmer('hide');
	}

	showCountdownDimmer() {
		//Inspired from http://jsfiddle.net/wz32sy7y/558/
		$('.countdown-dimmer').dimmer('show');
		$('.countdown-item h2').text("-");

		let numCountdownStartTime = 4;
		// let numInitialOffset = "440";
		let numInitialOffset = 0;
		let numFinalOffset = 440;
		let i = 1;

		// $('.circle_animation').css('stroke-dashoffset', numInitialOffset-(i*(numInitialOffset/numCountdownStartTime)));
		// $('.circle_animation').css('stroke-dashoffset', numInitialOffset + ( i * (numFinalOffset/numCountdownStartTime )));
		$('.circle_animation').css('stroke-dashoffset', numInitialOffset);

		let countdownInterval = setInterval(() => {
			$('.countdown-item h2').text(numCountdownStartTime - i) ;
			// $('.circle_animation').css('stroke-dashoffset', numInitialOffset + ( (i+1) * (numFinalOffset/numCountdownStartTime )));
			// $('.circle_animation').css('stroke-dashoffset', numInitialOffset + ( (i) * (numFinalOffset/numCountdownStartTime )));
			
			if (i == numCountdownStartTime + 1 ) {  	
				clearInterval(countdownInterval);
				this.hideCountdownDimmer();

				this.playSnake();
				$('.countdown-item h2').text("PLAY");
			} else {
				$('.circle_animation').css('stroke-dashoffset', numInitialOffset + ( (i) * (numFinalOffset/numCountdownStartTime )));
			}
			// $('.circle_animation').css('stroke-dashoffset', numInitialOffset-((i+1)*(numInitialOffset/numCountdownStartTime)));
			// $('.circle_animation').css('stroke-dashoffset', numInitialOffset-((i+1)*(numInitialOffset/numCountdownStartTime)));
			i++;  
		}, 1000);
		// }, 800);
	}

	hideCountdownDimmer() {
		$('.countdown-dimmer').dimmer('hide');
	}

	isSnakeBody(jsonCoordinate, arrSnakeBody) {
		return this.coordinateInArray(jsonCoordinate, arrSnakeBody);
	}

	/*
	* @desc : Checks if given coordinate exists in given array of coordinates
	* @param : json : jsonCoordinate. Array : arrJsonCoordinates
	* @return : Bool. True if given coordinate is in given array, else false.
	*/
	coordinateInArray(jsonCoordinate, arrJsonCoordinates) {

		let boolInArray = false;

		$.each(arrJsonCoordinates,function(key,jsonCoordinateFromArr) {
			if(jsonCoordinate.x == jsonCoordinateFromArr.x && jsonCoordinate.y == jsonCoordinateFromArr.y) {
				boolInArray = true;
				return false; // break
			}
		});

		return boolInArray;
	}

	/*
	* @desc : Checks if the given coordinate is a Correct/Incorrect/ISA Food
	* @param : json. Coordinates. {x:,y:}
	* @return : int. 
	*/
	checkForFood(jsonCoordinates, arrFoodOnBoard) {

		//console.log("checking for food ",jsonCoordinates , arrFoodOnBoard);
		
		let numResult = this.CONST_IS_NOT_FOOD;

		$.each(arrFoodOnBoard, (key,jsonFoodOnBoard) => {
			if(this.compareCoordinates(jsonCoordinates,jsonFoodOnBoard.jsonCoordinates)) {
				if(jsonFoodOnBoard.boolIsCorrect) {
					numResult = this.CONST_IS_CORRECT_FOOD;
					return false ; // break;
				} else {
					numResult = this.CONST_IS_INCORRECT_FOOD;
					return false ; // break;
				}
			} 
		});

		// //console.log("check food returning ", numResult);
		return numResult;
	}

	compareCoordinates(jsonCoordinate1 ,jsonCoordinate2) {
		return jsonCoordinate1.x == jsonCoordinate2.x && jsonCoordinate1.y == jsonCoordinate2.y;
	}

	/*
	* @desc : Moves the snake 
	* @param : templateInstance
	*/
	moveSnake() {
		// console.log("Moving Snake");

		// //console.log(templateInstance.Snake.get("snake").degreeOfFreedom);

		let oSnake = this.RD_Snake.get("oSnake");

		let jsonNewBeginning = this.getNewHead(oSnake.arrBodyData[0],oSnake.strHeading);

		if( this.isBorder(this.scaleCoordinateByBoxSize(jsonNewBeginning)) ) {
			// //console.log(" hit the border ");
			// stopSnake(templateInstance);
			// showDimmer();
			// alert("game over! you lose");
			this.gameOver(this.CONST_HIT_THE_BORDER);
			return false;
		} 
		if( this.isSnakeBody(jsonNewBeginning,oSnake.arrBodyData) ) {
			// //console.log(" Bit Yourself ");
			// stopSnake(templateInstance);
			// alert("Sorry! Bit yourself, game over! you lose");
			this.gameOver(this.CONST_BIT_ITSELF);
			return false;
		}

		let numFoodStatus = this.checkForFood(
								this.scaleCoordinateByBoxSize(jsonNewBeginning) , 
								this.RD_FoodSettings.get("arrFoodOnBoard")
							);
		
		// let numFoodStatus = this.CONST_IS_NOT_FOOD;
		//console.log("Food Status ",numFoodStatus);
		
		switch(numFoodStatus) {
			case this.CONST_IS_NOT_FOOD :
				oSnake.arrBodyData.pop(); // Remove the tail rect.
				oSnake.arrBodyData.unshift(jsonNewBeginning); // adds to the top
	    		
	    		this.RD_Snake.set("oSnake",oSnake);
	    		// console.log(oSnake.arrBodyData[0].x + "," + oSnake.arrBodyData[0].y);
				break;
			case this.CONST_IS_CORRECT_FOOD : 

				this.RD_GameData.set("numPoints",this.RD_GameData.get("numPoints") + 1);

				oSnake.arrBodyData.unshift(jsonNewBeginning); // adds to the top

	    		this.RD_Snake.set("oSnake",oSnake);
				

				if(!this.changeQuestion()) {
					// stopSnake(templateInstance);
					// alert("Congratulations! you win");
					this.gameOver(this.CONST_GAME_WON);
				}

				//console.log("Ate Correct Food");
				break;
			case this.CONST_IS_INCORRECT_FOOD : 
				oSnake.arrBodyData.unshift(jsonNewBeginning); // adds to the top
				// //console.log("Ate Incorrect Food");
				// stopSnake(templateInstance);
				// alert("game over! you lose");
				this.gameOver(this.CONST_ATE_INCORRECT_FOOD);
				return false;
				break;
			/*
			*/
		}
		
	}

	initBoard() {
		this.initSnake();
		this.arrAskedQuestionIds = []; // reset already asked questions array.

		this.RD_FoodSettings.set("arrFoodOnBoard", []);

		this.RD_GameData.set("numPoints", 0);
	}

	/*
	* @desc : Initialize the Snake with Settings.
	*/
	initSnake() {
		// console.log("Initializing Snake");

		let oSnake = {
			arrBodyData : [],
			strHeading : "left", // Direction in which the snake is heading.
			numInitialSnakeLength : 7
		};

		let arrInitialSnakePositions = [],
	    	x = 1, // snake initial x coordinate
	    	y = 2; // snake initial y coordinate

		for(let i = 0; i < oSnake.numInitialSnakeLength; i++) {
	        arrInitialSnakePositions.unshift({x: x++,y: y}); // unshift will add the the beginning of they array.
	    }
	    oSnake.arrBodyData = arrInitialSnakePositions;
	    oSnake.strHeading = 'right';

	    this.RD_Snake.set("oSnake",oSnake);
	}

	scaleByBoxSize(num) {
		return num*this.oSettings.numBoxSize;
	}

	gamePoints() {
		// console.log(this.RD_GameData.get("numPoints"));
		return this.RD_GameData.get("numPoints");
	}

	gameStatusIsPlaying() {
		let numCurrGameStatus = this.getGameStatus() ;

		if(numCurrGameStatus == this.CONST_GAME_STATUS_PLAYING) {
			return true;
		} else {
			return false;
		}
	} 

	gameStatusIsPaused() {
		numCurrGameStatus = this.getGameStatus() ;

		if(numCurrGameStatus == this.CONST_GAME_STATUS_PAUSED) {
			return true;
		} else {
			return false;
		}
	}

	getGameStatus() {
		return this.RD_GameData.get("numGameStatus");
	}

	changeQuestion(){
		// getNextQA(templateInstance);
		let jsonNextQA = this.getNextQAFromDb();
		// console.log(jsonNextQA);
		if(jsonNextQA) {
			this.RD_QASettings.set("jsonCurrActiveQA",jsonNextQA);
			this.createFoodForActiveQuestion();
			return true;
		} else {
			return false;
		}
	}

	setSessionVariables() {
		Session.setDefault("strDifficulty","easy");
		Session.setDefault("strCategory","mathamatics");
	}

	getNextQAFromDb() {

		let strQuery = {
			$and : [ 
				{ 
					$or : [ 
						{ strDifficulty : Session.get("strDifficulty") }
					]
				}, 
				{ strQuestion : { $exists : true } }, 
				{ arrCategories : { "$in" : [Session.get("strCategory")] } } , 
				{ _id : { $nin : this.arrAskedQuestionIds } } 
			]
		};

		// console.log(strQuery);
		let numColCount = cQA.find(strQuery).count();

		// console.log("Questiong left ", numColCount);

		let numRandom = Math.floor(Math.random() * numColCount);

		/*
		var jsonNextQA = cQA.findOne({ 
			$and : [ 
				{ 
					$or : [ 
						// { strDifficulty : "easy" } ,
						// { strDifficulty : "intermediate" } 
						{ strDifficulty : Session.get("strDifficulty") }
					]
				}, 
				{ strQuestion : { $exists : true } }, 
				// { arrCategories : { "$in" : ["mathamatics"] } } , 
				{ arrCategories : { "$in" : [Session.get("strCategory")] } } , 
				{ _id : { $nin : arrAskedQuestionIds } } 
			]
		});
		*/
		// var jsonNextQA = cQA.find(strQuery).limit(1).skip(numRandom);
		// var jsonNextQA = cQA.find(strQuery, {skip: numRandom, limit : 1}).fetch();
		let jsonNextQA = cQA.findOne(strQuery,{skip: numRandom});
		
		// console.log("Next Question ", jsonNextQA);

		if(jsonNextQA) {
			this.arrAskedQuestionIds.push(jsonNextQA._id);
		}

		return jsonNextQA;
	}

	createFoodForActiveQuestion() {
		// numCurrActiveQAIndex = templateInstance.QASettings.get("numCurrActiveQAIndex");
		// jsonCurrActiveQuestion = jsonQA[numCurrActiveQAIndex];	
		let jsonCurrActiveQuestion = this.RD_QASettings.get("jsonCurrActiveQA");;	
		let arrFoodCoordinates = this.getFoodCoordinatesOnBoard(jsonCurrActiveQuestion.arrAnswers.length);

		let i = 0;
		let boolIsCorrect = 0;

		// arrFoodOnBoardResult = [];
		let arrFoodOnBoard = [];
		$.each(jsonCurrActiveQuestion.arrAnswers,(key,jsonAnswer) => {
			
			boolIsCorrect = jsonAnswer.boolIsCorrect ? 1 : 0 ;

			jsonFoodOnBoardResult = {
				x:this.scaleByBoxSize(arrFoodCoordinates[i].x),
				y:this.scaleByBoxSize(arrFoodCoordinates[i].y),
				boolIsCorrect: boolIsCorrect
			};

			// arrFoodOnBoardResult.push(jsonFoodOnBoardResult);

			arrFoodOnBoard.push({
				jsonCoordinates : {
					x:this.scaleByBoxSize(arrFoodCoordinates[i].x),
					y:this.scaleByBoxSize(arrFoodCoordinates[i].y)
				},
				strOption: jsonAnswer.strLabel,
				boolIsCorrect : boolIsCorrect
			});

			i++;
		});
		this.RD_FoodSettings.set("arrFoodOnBoard", arrFoodOnBoard);

		// //console.log("Food ",arrFoodOnBoardResult);
	}
	
	/*Makes sure that the food is not in snakes path after gobble*/
	getFoodCoordinatesOnBoard(numCount) {
		
		let oSnake = this.RD_Snake.get("oSnake");
		let strDirection = oSnake.strHeading;
		let jsonCurrHead = oSnake.arrBodyData[0];

		let numLowerlimit = 0;
		let numUpperLimit = this.oSettings.numBoardSize/this.oSettings.numBoxSize - this.oSettings.numBoxSize;

		let arrRamdomCoordinates = [];

		for (let i = 0; i < numCount; i++ ){
			
			while(true) {
			
				let jsonCoordinate = { 
					x: Math.floor((Math.random()*numUpperLimit)+1) , 
					y: Math.floor((Math.random()*numUpperLimit)+1)
				};

				/*Check that new food is not in the same vector in which the snake is moving*/
				switch(strDirection) {
					case 'up':
						if((jsonCoordinate.y <= jsonCurrHead.y) && (jsonCoordinate.x == jsonCurrHead.x)) continue;
						break;
					case 'right':
						if((jsonCoordinate.x >= jsonCurrHead.x) && (jsonCoordinate.y == jsonCurrHead.y))  continue;
						break;
					case 'down':
						if((jsonCoordinate.y >= jsonCurrHead.y) && (jsonCoordinate.x == jsonCurrHead.x)) continue;
						break;
					case 'left':
						if((jsonCoordinate.x <= jsonCurrHead.x) && (jsonCoordinate.y == jsonCurrHead.y)) continue;
						break;
				}

				//Check if value exists in Array.
				if (!this.coordinateInArray(jsonCoordinate, arrRamdomCoordinates)) {
					// not in array.
					arrRamdomCoordinates.push(jsonCoordinate);
					break;
				}
			}

		}

		return arrRamdomCoordinates;
	}

	/*
	getRandomCoordinatesOnBoard(numCount) {
		
		let numLowerlimit = 0;
		let numUpperLimit = this.oSettings.numBoardSize/this.oSettings.numBoxSize - this.oSettings.numBoxSize;

		let arrRamdomCoordinates = [];

		for (let i = 0; i < numCount; i++ ){
			while(true) {

				let jsonCoordinate = { 
					x: Math.floor((Math.random()*numUpperLimit)+1) , 
					y: Math.floor((Math.random()*numUpperLimit)+1)
				};

				//Check if value exists in Array.
				if (!this.coordinateInArray(jsonCoordinate, arrRamdomCoordinates)) {
					// not in array.
					arrRamdomCoordinates.push(jsonCoordinate);
					break;
				}
			}

		}

		return arrRamdomCoordinates;
	}
	*/

	foodOnBoard() {
		//console.log(Template.instance().FoodSettings.get("arrFoodOnBoard"));
		return this.RD_FoodSettings.get("arrFoodOnBoard");
	}

	/*
	numCurrActiveQA : function() {
		return Template.instance().QASettings.get("numCurrActiveQAIndex") + 1 ;
	},
	*/
	currActiveQA() {
		// //console.log("here");
		// //console.log("idx ",Template.instance().QASettings.get("numCurrActiveQAIndex"));
		// //console.log("json ",jsonQA);
		// return jsonQA[Template.instance().QASettings.get("numCurrActiveQAIndex")];
		// console.log(this.RD_QASettings.get("jsonCurrActiveQA") );
		return this.RD_QASettings.get("jsonCurrActiveQA") ;
	}

	addBoxSizeToInt(num) {
		return num + this.oSettings.numBoxSize;
	}

	shareScoreOnFacebook() {
		//Read Here https://developers.facebook.com/docs/sharing/reference/share-dialog
		FB.ui({
			method : 'share',
			href : 'http://www.nerdsnake.com', // By Default Fb takes current URL
			// href : 'localhost:3000', // By Default Fb takes current URL
			hashtag : '#nerdsnake'
		}, function(response){
			console.log(response);
		});
	}

	shareScoreOnTwitter() {

		let hastags = "nerdsnake";
		window.open("https://twitter.com/intent/tweet?text= My points : " +this.gamePoints.call(this)+ ". Is your snake nerdier than mine?  Check out at www.nerdsnake.com &hashtags=NerdSnake&url=www.nerdsnake.com");
		// window.open("https://twitter.com/intent/tweet?text=@nerdsnake&url=www.&via=NerdSnake");
	}

	render() {
		// console.log(this.getSnake.bind(this));
		// console.log(this.RD_Snake);
		// console.log(this.getSnake());
		return (
			<div className = "game-component" onLoad = {gameComponentLoaded()}>

				{/*<!-- Start Modal -->*/}

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

				{/*<!-- Start Game Instructions Modal -->*/}
				<div className = "ui modal game-instructions-modal">
			        <div className = "header font25"> Game Instructions </div>
			        <div className = "content">
			            <GameInstructions />
			        </div>
			        <div className = "actions">
			            <div className = "ui positive right tabled icon button .approve">
			                Got it! Let's Play <i className = "checkmark icon"></i>
			            </div>
			        </div>
			    </div>
				{/*<!-- End Game Instructions Modal -->*/}

				{/*<!-- End Modal -->*/}

				<div className = "game-strip">

					{/*<!-- Start Dimmer -->*/}
					<div className = "ui dimmer final-result-dimmer">
			            <div className = "content">
			                <div className = "center">
			                    <div className="ui huge buttons">
			                        <button className = "ui button play-snake" onClick = {this.playSnakeClickEvent.bind(this)} >Play Again</button>
			                        <div className="or"></div>
			                        {/*<!-- <button className = "ui teal button new-game">Reset</button> -->*/}
			                        <button className = "ui positive button new-game"  onClick = {this.newGameClickEvent.bind(this)} >Reset Setting</button>
			                    </div>
			                    <h2 >{this.getGameEndReasonString.call(this)}</h2>

			                    <div className="ui statistic points-div">
									<div className="value">{this.gamePoints.call(this)}</div>
									<div className="label"> Points </div>
								</div>
			                    {/*<h2>Your Snake is so Nerdy that even Kaa (Jungle Book guys) could not hypnotize him.... Points : {this.gamePoints.call(this)}</h2>*/}

			                    { this.currActiveQA.call(this) ?
			                    	<div className = "mb30" >
										<p className = "question">
											{this.currActiveQA.call(this).strQuestion}
										</p>
										{this.currActiveQA.call(this).arrAnswers.map((oAnswer,idx)=>{
											let strClassName = "answer-option";
											if(oAnswer.boolIsCorrect) strClassName = strClassName + " correct-answer"; 

					                    	return (
					                    		<p key = {idx} className = {strClassName} ><b className = "answer-option-label">{oAnswer.strLabel}</b> : {oAnswer.strValue}</p>
					                    	)
										})}
									</div> : ''
			                    }
			                    <div className = "to-hide-not">
				                    <button className="ui facebook button" onClick = {this.shareScoreOnFacebook.bind(this)} >
				                        <i className="facebook icon"></i>Facebook
				                    </button>
				                    <button className="ui twitter button" onClick = {this.shareScoreOnTwitter.bind(this)}>
				                        <i className="twitter icon"></i>Twitter
				                    </button>
								</div>

			                </div>
			            </div>
			            
		                <div className = "hide-dimmer top-right-10">
		                	<b onClick = {this.hideDimmer.bind(this)}> <i className = "remove icon"></i> Close </b>
		                </div>
		            	
			        </div>
			        {/*<!-- End Dimmer -->*/}

					<div className = "game-strip-container">

						<div className = "container">
							<div className = "ui grid">
								
								<div className = "two wide column"></div>

								<div className = "twelve wide column">

									<div className = "ui grid game-strip-container inner-game-strip-container">

										<div className = "two wide column">
											<div className="ui statistic points-div">
												{/*<div className="value">{{gamePoints}}</div>*/}
												<div className="value">{this.gamePoints.call(this)}</div>
												<div className="label"> Points </div>
											</div>
										</div>
										
										<div className = "seven wide column">
											<div className = "" >

												<svg className = "game-container-svg" 
													width = {this.oSettings.numBoardSize}
													height = {this.oSettings.numBoardSize}>

							                        { this.RD_Snake.get("oSnake").arrBodyData.map((oCoordinates,idx) => {
							                            return ( 
							                            	<rect 
							                            		key={idx}
							                            		className = "snake-body" 
							                            		width = {this.oSettings.numBoxSize}
							                            		height = {this.oSettings.numBoxSize} 
							                            		x = {this.scaleByBoxSize(oCoordinates.x)}
							                            		y = {this.scaleByBoxSize(oCoordinates.y)} 
							                            		rx="0" 
							                            		ry="0" ></rect>
							                            );
													})}
							                        { this.foodOnBoard.call(this).map((oFoodData,idx)=>{
							                        	return (
							                        		<text 
							                        			key = {idx}
							                        			x = {oFoodData.jsonCoordinates.x}
							                        			y = {this.addBoxSizeToInt.call(this,oFoodData.jsonCoordinates.y)}
							                        			textAnchor = "start"
							                        			>{oFoodData.strOption}</text>
							                        	)
							                        })}
							                    </svg>
											</div>
											<div className="ui dimmer countdown-dimmer">
												<div className="content countdown-dimmer-content">
													<div className = "countdown-item">
														<h2>3</h2>
														<svg width = "160" height = "160">
															<circle id = "countdown-circle" className = "circle_animation" r = "69.85699" cy = "81" cx = "81" strokeWidth = "8" stroke = "#21BA45" fill = "none"/>
														</svg>
														<h3>Use arrow keys <strong className = "arrowIcons" > <i className="arrow left icon"></i> <i className="arrow up icon"></i> <i className="arrow right icon"></i> <i className="arrow down icon"></i> </strong> on your keyboard.</h3>
													</div>
												</div>
											</div>
										</div>

										<div className = "seven wide column">
											<div className = "QA">

												{this.gameStatusIsPlaying.call(this) ? 
													<div>
														<div className = "ui grid">
															<div className = "six wide column question-tag mb30">QUESTION <i className="arrow down icon"></i></div>
														</div>

														<p className = "question">
															{this.currActiveQA.call(this).strQuestion}
														</p>
														{this.currActiveQA.call(this).arrAnswers.map((oAnswer,idx)=>{
									                    	return (
									                    		<p key = {idx} className = "answer-option"><b className = "answer-option-label">{oAnswer.strLabel}</b> : {oAnswer.strValue}</p>
									                    	)
														})}
														{/*
														<p className = "question">{{currActiveQA.strQuestion}}</p>
														{{#each currActiveQA.arrAnswers}}
									                    	<p className = "answer-option"><b className = "answer-option-label">{{strLabel}}</b> : {{strValue}}</p>
									                    {{/each}}
														*/}

													</div>
													: ''
												}

												{this.gameStatusIsPaused.call(this) ? 
													<div>
														<div className = "mb30" >
															<button className = "play-snake ui button" onClick = {this.playSnakeClickEvent.bind(this)} >Play</button>
															<button className = "new-game ui positive button" onClick = {this.newGameClickEvent.bind(this)} >Reset</button>
															<button className = "btn-instructions ui button" onClick = {this.showInstructions.bind(this)}>Instructions</button>
														</div>
														<p className = "question-message"> Questions will appear here. </p>
													</div>
													: ''
												}
												{/*<button className = "new-game ui positive button">Reset</button>*/}
											</div>
										</div>
										

									</div>

									<div className = "ui grid game-strip-container move-to-laptop-desktop">
										<p className="move-to-laptop-desktop-p">
											{/*Sorry! <i className = "frown icon"></i> The game cannot be played on mobile. */}
											Welcome to NerdSnake. Please open the website on your laptop or desktop to play the game.
										</p>
									</div>

								</div>

								<div className = "two wide column">
								</div>

							</div>
						</div>
					</div>

				</div>

			</div>
		);
	}
}