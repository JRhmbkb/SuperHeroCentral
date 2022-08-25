import React from 'react';
import {
    Navbar,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink
  } from "shards-react";

class MenuBar extends React.Component {
    render() {
        return(
            <Navbar type="dark" theme="danger" expand="md">
        <NavbarBrand href="/">Super Hero Central</NavbarBrand>
          <Nav navbar>
          <NavItem>
              <NavLink active href="/">
                Home
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink active href="/powers">
                Powers
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink active  href="/versus" >
                Versus
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink active  href="/recommendations" >
                Recommendations
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink active  href="/marvel-dc" >
                Marvel vs. DC
              </NavLink>
            </NavItem>
          </Nav>
      </Navbar>
        )
    }
}

export default MenuBar
