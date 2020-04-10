import React from 'react';
import logo from './logo.svg';
import './App.css';
import ExForm from './Forms.js';

//<ExForm submit='url' form='url' />

class App extends React.Component {
	constructor() {
		super();
		this.state = {volunteers: []};
	}

	componentWillMount() {
		this.refreshVolunteers();
	}

	render() {
		return (
			<div id="app">
				<section id="volunteers">
					<ExForm
						title="Add a Volunteer"
						form_url='/api/volunteers/forms/add-volunteer' 
						submit_to='/api/volunteers/add'
						submit_text="Add"
						onSubmit={this.refreshVolunteers.bind(this)}
					/>

					<div className="volunteers">
						<h2>Volunteer List</h2>
						{this.state.volunteers.map(volunteer => {
							return <div className="volunteer">
								<p> { volunteer.name }  </p>
								<p> { volunteer.email } </p>
								<p> <button className="secondary">Load Schedule</button></p>
							</div>
						})}
					</div>
					
				</section>

				<section id="schedule">
					{//<ExForm form_url='/api/schedule/forms/add' submit_to='/api/schedule/add' />
					}
				</section>
			</div>
		);
	}

	refreshVolunteers() {
		fetch('/api/volunteers/list')
			.then(response => response.json())
			.then(volunteers => this.setState({volunteers: volunteers})
		);
	}


}

export default App;
