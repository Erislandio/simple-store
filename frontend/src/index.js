import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Dashboard from './components/Admin/Dashboard';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import SignUp from './components/signup/SignUp'
import Login from './components/login/Login'
import ForgotPass from './components/forgotpassword/ForgotPass'

import Cookies from 'js-cookie'

function RouterChange() {

    const sessions = Cookies.get('sessions')
   
    return (
        <Router>
            <Route exact path="/admin" redirect="/admin" component={Dashboard} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={SignUp} />
            <Route path="/forgotpassword" component={ForgotPass} />
        </Router>
    )

}

ReactDOM.render(<RouterChange />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
