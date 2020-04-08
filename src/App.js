import React from 'react';
import logo from './logo.svg';
import './App.css';

class App extends React.Component {
	constructor() {
		super();
		this.state = {forms: [], volunteers: []};
	}

	componentDidMount() {
		fetch('/volunteers/forms/add-user')
			.then(response => response.json())
			.then(form => {
				this.setState({forms: {add_user: form}});
			});

		fetch('/volunteers/list')
			.then(response => response.json())
			.then(volunteers => {
				this.setState({volunteers: volunteers});
			});

		fetch('/schdule/forms/edit-schedule')
			.then(response => response.json())
			.then(form => {
				this.setState({forms: {edit_scheulde: form}})
			});
	}

	render() {
		return (
			<div id="app">
				<section id="users">
					<AddUserForm form={this.state.forms.add_user} />

					<div className="volunteers">
						{this.state.volunteers.map(volunteer => {
							return <div className="volunteer">
								<h3> { volunteer.name }  </h3>
								<p> { volunteer.date_created } </p>
							</div>
						})}
					</div>
					
				</section>

				<section id="schedule">
					<ScheduleForm form={this.state.forms.edit_schedule } />
				</section>
			</div>
		);
	}
}

class ExForm extends React.Component {
	constructor(props) {
		super();
		this.state = props.form;
	}

	render() {
		const props = this.props;
		const state = this.state;

		return (
			<form action={state.submit_url} method={state.method}>
				{ state.fields }
			</form>
		);
	}

	submit() {
		const fields = JSON.stringify(this.state.fields.forEach((field) => {
			let data = {};
			data[field.name] = field.value;
			return data;
		}));


		const args = {
			method: this.state.method, 
			headers: { 
				'Content-Type': 'application/json',
				'Credentials': 'same-origin'
			}
		};

		const url = this.state.submit_url;

		if (this.state.method == 'POST')
			args['body'] = fields;
		else if (this.state.method == 'GET')
			url += '?' + fields;

		fetch(this.state.submit_url, args);

	}
}

class ScheduleForm extends React.Component {
	render() {
		return <ExForm form={this.props.form} />;
	}
}

class AddUserForm extends React.Component {
	render() {
		return <ExForm form={this.props.form} />;
	}
}



export default App;
