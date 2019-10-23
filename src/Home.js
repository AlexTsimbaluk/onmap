import React, { Component } from 'react';
import fire from './config/Fire';

import Map from './Map';

class Home extends Component {
	constructor(props) {
		super(props);

		this.logout = this.logout.bind(this);
	}

	logout() {
		fire.auth().signOut();
	}

	render() {
		return (
			<div>
				<Map />
				
				<div className="position-fixed user-signed">
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
				</div>
			</div>
		);
	}

}

export default Home;