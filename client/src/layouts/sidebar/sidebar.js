import React, { Component } from "react";
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import UserIcon from '@material-ui/icons/PermIdentity';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import FileIcon from '@material-ui/icons/InsertDriveFile';
import MoneyIcon from '@material-ui/icons/AttachMoney';
import HelpIcon from '@material-ui/icons/Help';
import ContactIcon from '@material-ui/icons/ContactMail';

import styled from "styled-components";

const StyledDrawer = styled(Drawer)`
  & > div {
    margin-top: 4.05rem;
  }
`;

function SideBar ({window}) {
    const container = window !== undefined ? () => window().document.body : undefined;
      const drawer = (
        <div>
          <div />
          <Divider />
          <List>
          <ListItem button key={"Home"}>
                <ListItemIcon><HomeIcon /></ListItemIcon>
                <ListItemText primary={"Home"} />
          </ListItem>
          <ListItem button key={"Profile"}>
                <ListItemIcon><UserIcon /></ListItemIcon>
                <ListItemText primary={"Profile"} />
          </ListItem>
          <ListItem button key={"PolicyRegistration"}>
                <ListItemIcon><FileIcon /></ListItemIcon>
                <ListItemText primary={"Policy Registration"} />
          </ListItem>
          <ListItem button key={"ClaimProcess"}>
                <ListItemIcon><MoneyIcon /></ListItemIcon>
                <ListItemText primary={"Claim Process"} />
          </ListItem>
          <Divider />
          <ListItem button key={"About"}>
                <ListItemIcon><HelpIcon /></ListItemIcon>
                <ListItemText primary={"About"} />
          </ListItem>
          <ListItem button key={"Contact"}>
                <ListItemIcon><ContactIcon /></ListItemIcon>
                <ListItemText primary={"Contact"} />
          </ListItem>
          </List>
        </div>
      );
    return (
        <nav aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <StyledDrawer className="drawer"
            container={container}
            variant="temporary"
            anchor={'right'}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </StyledDrawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <StyledDrawer
            variant="permanent"
            open
          >
            {drawer}
          </StyledDrawer>
        </Hidden>
      </nav>
    );
}

export default SideBar;