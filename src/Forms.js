import React from 'react';


const getCookie = (key) => {
	const cookies = document.cookie.split(';');
	for (let i = 0;i < cookies.length;++i) {
		let cookie = cookies[i].split('=');
		if (cookie[0] == key) {
			return cookie[1];
		}
	}
};

const Fields = {
	CharField: (props) => {
		return <input type="text" {...props} />
	},
	EmailField: (props) => {
		return <input type="email" {...props} />;
	},
	PasswordField: (props) => {
		return <input type="password" {...props} />;
	}
};

class FormField extends React.Component {
	render() {
		const props = this.props;

		const field = Fields[props.type](props);
		return <div className="form-field">
				<label html_for={props.name}>{props.name}</label>
				{field}
			</div>;
	}
}

const ExFormContext = React.createContext();

class ExForm extends React.Component {
	constructor(props) {
		super();

		this.state = {fields: {}, method: 'GET', errors: []};
	}

	componentWillMount() {
		fetch(this.props.form_url)
			.then(response => response.json())
			.then(form => {
				this.setState({fields: form.fields, method: form.method});
			});
	}

	render() {
		const submit_text = this.props.submit_text ? this.props.submit_text : 'Submit';
		return (
			<form className="form" action={this.props.submit_url} method={this.state.method}>
				<h2> {this.props.title ? this.props.title:''}</h2>
				
				{this.state.errors.length == 0 ?
					'':<div className="form-errors">
						{this.state.errors.map((field, key) => {
							return <li key={key}>{field.field} - {field.message}</li>;
						})}
					</div>}

			{Object.keys(this.state.fields).map(
					(field, key)=> 
						<FormField 
							onChange={this.onFieldValueChange.bind(this)}
							key={key}
							name={field}
							type={this.state.fields[field].type}
					/>)}
				<button className="primary" onClick={this.submit.bind(this)}>{submit_text}</button>
			</form>
		);
	}



	submit(e) {
		e.preventDefault();
		this.setState({errors: []});

		let fields = {};

		Object.keys(this.state.fields).forEach((name) => {
			fields[name] = this.state.fields[name].value;
		});

		const args = {
			method: this.state.method, 
			headers: { 
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Credentials': 'same-origin',
				'X-CSRFToken': getCookie('csrftoken')
			}
		};

		let url = this.props.submit_to;
		const params = JSON.stringify(fields);

		args['method'] = this.state.method;

		if (this.state.method == 'POST') 
			args['body'] = params;
		else if (this.state.method == 'GET')
			url += '?' + params;

		fetch(url, args)
			.then(response => {
				if (response.status == 500) {
					return (
						response.json()
						.then(errors => {
							const e = Object.keys(errors).map(field=> {
								return {field: field, message: errors[field][0].message};
							});
							this.setState({errors: e});
						})
					);
				}
			})
			.then(response => {
					this.props.onSubmit();
			});

	}

	onFieldValueChange(e) {
		const _fields = {...this.state.fields};
		_fields[e.target.name].value = e.target.value;

		this.setState({fields: _fields})
	}
}

export default ExForm;
