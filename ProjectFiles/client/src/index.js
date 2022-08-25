import React from 'react';
import ReactDOM from 'react-dom';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';

import HomePage from './pages/HomePage';
import PowersPage from './pages/PowersPage';
import VersusPage from './pages/VersusPage';
import 'antd/dist/antd.css';

import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css"
import RecommendationsPage from './pages/RecommendationsPage';
import MarvelVsDCPage from './pages/MarvelVsDCPage';

ReactDOM.render(
  <div>
    <Router>
      <Switch>
        <Route exact
							path="/"
							render={() => (
								<HomePage />
							)}/>
        <Route exact
							path="/powers"
							render={() => (
								<PowersPage />
							)}/>
        <Route exact
							path="/versus"
							render={() => (
								<VersusPage />
							)}/>
		<Route exact
							path="/recommendations"
							render={() => (
								<RecommendationsPage />
							)}/>
		<Route exact
							path="/marvel-dc"
							render={() => (
								<MarvelVsDCPage />
							)}/>
      </Switch>
    </Router>
  </div>,
  document.getElementById('root')
);

