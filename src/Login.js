import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import fire from './config/Fire';

class Login extends Component {
  constructor(props) {
    super(props);

    this.login = this.login.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.signup = this.signup.bind(this);

    this.state = {
      email: '',
      password: ''
    };
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  login(e) {
    e.preventDefault();

    fire.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then((u)=>{
      console.log(u);
    }).catch((error) => {
      console.log(error);
    });
  }

  signup(e){
    e.preventDefault();

    fire.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then((u)=>{
    }).then((u)=>{
      console.log(u);
    })
    .catch((error) => {
      console.log(error);
    });
  }
  render() {
    return (
      <div className="h-100">
        <div className="h-100 w-100 login-bg"></div>

        <div className="py-5">
          <h2 className="text-center">
            Notes on map
          </h2>

          <div className="text-center">
            Please log in to the service, or register if you are a new user
          </div>
        </div>

        <div className="d-flex justify-content-center">
          <form className="form-auth">
            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Email address</label>
              <input value={this.state.email} onChange={this.handleChange} type="email" name="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
              <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
            </div>

            <div className="form-group">
              <label htmlFor="exampleInputPassword1">Password</label>
              <input value={this.state.password} onChange={this.handleChange} type="password" name="password" className="form-control" id="exampleInputPassword1" placeholder="Password" />
            </div>

            <button type="submit" onClick={this.login} className="btn btn-primary">Login</button>
            
            <button onClick={this.signup} style={{marginLeft: '25px'}} className="btn btn-success">Signup</button>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;