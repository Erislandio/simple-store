import React, { Component } from 'react';
import MenuAppBar from '../Header/Header';
import TemporaryDrawer from '../Drawer/Drawer';

class Admin extends Component {
    render() {
        return (
            <div id="Admin">
                <MenuAppBar />
                <TemporaryDrawer />
            </div>
        );
    }
}

export default Admin;