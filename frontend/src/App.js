import React , {Component} from 'react';
import './App.css';
import { Auth0Lock } from 'auth0-lock';
import axios from 'axios';

const API_URL = 'https://slmv4vbjh1.execute-api.us-east-1.amazonaws.com/dev';

class App extends Component {
  constructor() {
    super();
    const auth0Options = {
      auth: {
        audience: API_URL,
        params: {
          scope: 'openid profile email'
        },
        responseType: 'token'
      }
    };
    const lock = new Auth0Lock(
      '0xvoup41lj2Dold6n8hqHnEOxHSV59rT',
      'tvs-dev.auth0.com',
      auth0Options
    );
    this.lock = lock;
    this.lock.on('authenticated',this.onAuthentication);
  } 

  state = {
    accessToken: localStorage.getItem('accessToken'),
    profile: JSON.parse(localStorage.getItem('profile')),
    response: null
  };

  showLogin = () => {
    this.lock.show();
  }
  
  logout = () => {
    this.lock.logout();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('profile');
    this.setState({
      accessToken: null,
      profile: null,
      response: null
    })
  }

  onAuthentication = (authResult) => {
    //console.log('authResult',authResult);
    localStorage.setItem('accessToken',authResult.accessToken);
    this.setState({
      accessToken: authResult.accessToken
    });
    //this.state.accessToken = authResult.accessToken;
    this.lock.getUserInfo(authResult.accessToken, this.getProfile)
}

getProfile = (error, profile) =>{
  if (error) {
    //console.log(error);
    // Handle error
    return;
  }  
  localStorage.setItem('profile',JSON.stringify(profile));
  //console.log(profile);
  this.setState({
    profile
  });
  //this.state.profile = profile;
}

makeRequest= () => {
  const bearerToken = this.state.accessToken ? 'Bearer '+this.state.accessToken : null;
  console.log(bearerToken);
  axios.get('/hello',{
    baseURL: API_URL,
    headers: {
      Authorization: bearerToken
    }
  }).then((response) => {
    //console.log(response);
    this.setState({
      response: response.data.message
    });
  }).catch((error) => {
    this.setState({
      response: 'An error occured'
    });
    console.error(error);
  }) 
}
  render() {
    return (
      <div className="App">
        <header className="App-header">
          {
            this.state.profile 
            ?
            (
              <div>
                <p>{this.state.profile.name} logged in</p>
                <button onClick={this.logout}>Logout</button>
              </div>
            )            
            : 
            (
              <div>
                <p>User not logged in</p>
                <button onClick={this.showLogin}>Login</button>
              </div>
            )
          }
          <br></br>
          <button onClick={this.makeRequest}>hello</button>
          <p>Response: {this.state.response}</p>
        </header>
      </div>
    );
  }
}


export default App;
