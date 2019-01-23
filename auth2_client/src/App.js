import React, { Component } from 'react';
import { Route, NavLink, Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { Button } from 'reactstrap';
import axios from 'axios';

import UserList from './components/UsersList';
import SignForm from './components/SignForm';

import './App.css';

class App extends Component {
	state = {
		users: [],
		modal: true
	};

	componentDidMount() {
		if (localStorage.getItem('jwtToken')) {
			this.getUsers();
		}
	}

	getUsers = async () => {
		try {
			const accessToken = localStorage.getItem('jwtToken');
			const config = { headers: { Authorization: accessToken } };
			const users = await axios.get('http://localhost:4000/api/users', config);

			this.setState({ users: users.data });
			this.props.history.push('/users');
		} catch (err) {
			console.log(err);
		}
	};

	logout = e => {
		e.preventDefault();
		this.setState({ users: [] });
		localStorage.removeItem('jwtToken');
		this.props.history.push('/');
	};

	render() {
		const { users, modal } = this.state;
		return (
			<div className="App">
				<h2>Welcome to the Auth II API React Client</h2>
				<nav>
					<NavLink to="/">Home</NavLink>
					{users.length !== 0 && <NavLink to="/users">Users</NavLink>}
				</nav>
				{users.length === 0 ? (
					<Link to="/signin">
						<Button color="primary">Login Here</Button>
					</Link>
				) : (
					<Button color="warning" onClick={this.logout}>
						Logout
					</Button>
				)}

				<Route exact path="/users" render={props => <UserList {...props} users={users} />} />
				<Route
					exact
					path="/signin"
					render={props => <SignForm {...props} getUsers={this.getUsers} modal={modal} />}
				/>
				<Route
					exact
					path="/signup"
					render={props => <SignForm {...props} getUsers={this.getUsers} modal={modal} signup />}
				/>
			</div>
		);
	}
}

export default withRouter(App);

// {
//   "username": "bossPerson",
//    "password": "apexPredator",
//    "departments": "admin"
// }
