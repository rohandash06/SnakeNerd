import {Meteor} from 'meteor/meteor' 
import React, {Component} from 'react'

export class ContactInformation extends Component {
	render() {
		return (
			<div className = "contact-information-component">
				<h3 className = "contact-information-heading mt30 font30 center"><b>Who To Blame?</b></h3>
				<hr className = "title-underline"/>

				<div className = "ui four column centered grid mt30">
					
					<div className = "twelve wide mobile four wide computer column">
						<div className="ui link cards centered">
							<div className="card">
								<div className="image">
									<img src="/img/aman-card-pic.jpg" />
								</div>
								<div className="content">
									<div className="header">Aman Minhas</div>
									<div className="meta"> 
										<a>Web Developer</a>
									</div>
									<div className="description">
										Passionate Web Developer <br/>
										Creator of <a href = "/">NerdSnake</a><br/>
										Co-Founder of <a href = "http://wipiway.com/" target = "_blank">Wipiway</a>
									</div>
								</div>
								<div className="extra content">
									{/*<!-- <span className="right floated"> Joined in 2013 </span>
									<span> <i className="user icon"></i> 75 Friends </span> -->*/}
									<div className = "center">
										<a href = "https://www.facebook.com/aman.minhas1" target = "_blank">
											<button className="ui circular facebook icon button">
												<i className="facebook icon"></i>
											</button>
										</a>
										<a href = "https://twitter.com/AmanMinhas16" target = "_blank">
											<button className="ui circular twitter icon button">
												<i className="twitter icon"></i>
											</button>
										</a>
										<a href = "https://www.linkedin.com/profile/view?id=AAMAAA9u8RkBCbc-yaFlSxQQsKFHpuklwdEBlGA&trk=hp-identity-photo" target = "_blank">
											<button className="ui circular linkedin icon button">
												<i className="linkedin icon"></i>
											</button>
										</a>
										{/*<!-- <a href = "https://www.facebook.com/aman.minhas1" target = "_blank"> -->*/}
										<a href = "mailto:nerdsnake@gmail.com?Subject=Message%20From%20Nerd%20Snake" target = "_top">
											<button className="ui circular google plus icon button">
												<i className="mail icon"></i>
											</button>
										</a>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className = "twelve wide mobile four wide computer column">
						<p className = "font20">You are welcome to get in touch with me for whatever the reason may be. Do let me know what you think about Nerd Snake, feedback is always welcome. Also, if you have a question in mind that you think would be a good addition to Nerd Snake, I would like to know about that too. Peace! </p>
					</div>
				</div>
			</div>
		)
	}
}
