var React = require('react');
var Main = require('../components/Main');
var Other = require('../components/Other');
var Home = require('../components/Home');
var Router = require('react-router');
var DefaultRoute = Router.DefaultRoute;
var Route = Router.Route;

module.exports = (
    <Route name="app" path="/" handler={Main}>
        <DefaultRoute handler={Home} />
        <Route name="other" path="/other" handler={Other} />
    </Route>
);