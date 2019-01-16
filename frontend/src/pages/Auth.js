import React, { Component } from 'react';

import './Auth.css';
import AuthContext from '../context/auth-context';

class AuthPage extends Component {
  state = {
    isLogin: true
  }

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
  }

  switchModeHandler = () => {
    this.setState(prevState => {
      return {isLogin: !prevState.isLogin};
    })
  }

  submitHandler = event => {
    event.preventDefault();
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    let requestBody = {
      query: `
        query {
          login(email: "${email}", password: "${password}") {
            userId
            token
            tokenExpiration
          }
        }
      `
    };

    if (!this.state.isLogin) {
      requestBody = {
        query: `
          mutation {
            createUser(userInput: {email: "${email}", password: "${password}"}) {
              _id
              email
            }
          }
        `
      }
    }

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(ctx => {
      if (ctx.status !== 200 && ctx.status !== 201) {
        throw new Error('Failed');
      }
      return ctx.json();
    })
    .then(ctxData => {
      if (this.state.isLogin) {
        this.context.login(ctxData.data.login.token, ctxData.data.login.userId)
      }
      console.log(ctxData)

    })
    .catch(err => {
      console.log(err);
      alert(err);
    })

    console.log(email, password);
  }

  render() {
    return (
      <form className="auth-form" onSubmit={this.submitHandler}>
        <h1>{this.state.isLogin ? ' Login' : ' Signup'}</h1>
        <div className="form-control">
          <input type="email" id="email" placeholder="Email" ref={this.emailEl} />
        </div>
        <div className="form-control">
          <input type="password" id="password" placeholder="Password" ref={this.passwordEl} />
        </div>
        <div className="form-actions">
          <button type="submit">Submit</button>
          <button type="button" onClick={this.switchModeHandler}>
            Switch to {this.state.isLogin ? ' Signup' : ' Login'}
          </button>
        </div>
      </form>
    );
  }
}

export default AuthPage;
