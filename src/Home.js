import React, { Component } from 'react';
import fire from './config/Fire';

import _places from './data/PLACES.json';

import Map from './Map';
import Search from './Search';

let places;

class Home extends Component {
	constructor(props) {
		super(props);

		this.state = ({
		  places: null
		});

		this.logout = this.logout.bind(this);
	}

	componentDidMount() {
	  places = JSON.parse(JSON.stringify(_places));
	  this.setState({places: places});
	}

	logout() {
		fire.auth().signOut();
	}

	render() {
	  // console.log(this.state.places);

		return (
			<div>
				<Map places={places} user={this.props.user} />				
				
				{/*<div className="position-fixed user-signed">
					<div className="badge badge-success">
						{this.props.user.email}
					</div>

					<div className="text-left mt-1">
						<button
							className="btn btn-sm btn-secondary"
							onClick={this.logout}
						>
							Logout
						</button>
					</div>

					<Search places={places} user={this.props.user} />
				</div>*/}
			</div>
		);
	}

}

export default Home;