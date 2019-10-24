import React, { Component } from 'react';
import './App.css';

import fire from './config/Fire';

import 'firebase/auth';

import Home from './Home';
import Login from './Login';

import './google-maps-1.webp';

class App extends Component {
  constructor() {
    super();

    this.state = ({
      user: null,
    });
    this.authListener = this.authListener.bind(this);
  }

  componentDidMount() {
    this.authListener();
  }

  authListener() {
    fire.auth().onAuthStateChanged((user) => {
      // console.log(user);
      
      if (user) {
        this.setState({ user });
        // localStorage.setItem('user', user.uid);
      } else {
        this.setState({ user: null });
        // localStorage.removeItem('user');
      }
    });
  }

  render() {
    return (
      <div className="App h-100">
        {
          this.state.user ? ( <Home user={this.state.user} />) : (<Login />)
        }
      </div>
    );
  }
}

export default App;
