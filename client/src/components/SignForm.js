import React from 'react';
import {
	Button,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Col,
	Form,
	FormGroup,
	Label,
	Input
} from 'reactstrap';
import axios from 'axios';

class SignForm extends React.Component {
	state = {
		username: '',
		password: '',
		departments: ''
	};

	handleChange = ({ target: { name, value } }) => {
		this.setState({ [name]: value });
	};

	onSubmit = async e => {
		e.preventDefault();
		try {
			const response = await axios.post(
				`http://localhost:4000/api/${this.props.signup ? 'register' : 'login'}`,
				this.state
			);
			if (!response.data.token) return alert('Username or password incorrect');
			localStorage.setItem('jwtToken', response.data.token);
			this.props.getUsers();
		} catch (err) {
			console.log(err);
		}
	};

	render() {
		const { email, password, departments } = this.state;
		const { signup, modal } = this.props;

		return (
			<div>
				<Modal isOpen={modal}>
					<ModalHeader>{signup ? 'Sign Up' : 'Login'}</ModalHeader>
					<ModalBody>
						<Form className="form">
							<Col>
								<FormGroup>
									<Label>username</Label>
									<Input
										type="text"
										name="username"
										placeholder="username"
										value={email}
										onChange={this.handleChange}
									/>
								</FormGroup>
							</Col>
							<Col>
								<FormGroup>
									<Label for="examplePassword">password</Label>
									<Input
										type="password"
										name="password"
										placeholder="********"
										value={password}
										onChange={this.handleChange}
									/>
								</FormGroup>
							</Col>
							{signup && (
								<Col>
									<FormGroup>
										<Label for="deparment">Departments</Label>
										<Input
											type="text"
											name="departments"
											placeholder="departments"
											value={departments}
											onChange={this.handleChange}
										/>
									</FormGroup>
								</Col>
							)}
							<Button type="submit" color="primary" onClick={this.onSubmit}>
								Submit
							</Button>
							<ModalFooter>
								<Button
									type="submit"
									color="info"
									onClick={() => this.props.history.push(`/${signup ? 'signin' : 'signup'}`)}
								>
									{signup ? 'Have An Account? Sign In Here' : 'Need An Account? Register Here'}
								</Button>
								<Button color="danger" onClick={() => this.props.history.push('/')}>
									Cancel
								</Button>
							</ModalFooter>
						</Form>
					</ModalBody>
				</Modal>
			</div>
		);
	}
}

export default SignForm;
