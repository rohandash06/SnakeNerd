import {Meteor} from 'meteor/meteor' 
import React from 'react';
import { render } from 'react-dom';
import { IndexRoute, Router, Route, browserHistory } from 'react-router';

import { MainLayout } from '/imports/ui/layouts/MainLayout.jsx';
import { GameComponent } from '/imports/ui/components/GameComponent.jsx';
import { Scribbles } from '/imports/ui/components/Scribbles.jsx';
import { Page404 } from '/imports/ui/components/Page404.jsx';

Meteor.subscribe('QA');

Meteor.startup( () => {
	render( 
		<Router history={ browserHistory }>
			<Route path="/" component={ MainLayout } >
				<IndexRoute component = {GameComponent} />
				<Route path="*" name="Page404" component={Page404}></Route>
			</Route>
		</Router>, 
		document.getElementById( 'app-body' ) 
	);
});