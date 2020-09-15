import React, { Component } from 'react'
import {Switch, Route, Link} from 'react-router-dom'


// Styles
import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'
import ProfileContainer from "./layouts/profile/ProfileContainer";
import HomeContainer from './layouts/home/HomeContainer'
import { Avatar } from "rimble-ui";

class App extends Component {
    render() {
        return (
            <div className="App">
                <nav className="navbar pure-menu pure-menu-horizontal">
                    <Link to="/" className="pure-menu-heading">Water Level Insurance</Link>
                    <ul className="pure-menu-list navbar-right">
                        <li className="pure-menu-item">
                            <Link to="/profile" className="pure-menu-link">Profile</Link>
                        </li>
                    </ul>
                </nav>
                <br/>
                <br/>
                <main className="container">
                    <div className="pure-g">
                    <Switch>
                            <Route exact={true} path="/" component={HomeContainer}/>
                            <Route exact={true} path="/profile" component={ProfileContainer}/>
                    </Switch>
                    </div>

                </main>
            </div>
        );
    }
}

export default App
