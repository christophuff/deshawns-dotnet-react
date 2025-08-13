import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from "reactstrap";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";

import { Outlet, useLocation } from "react-router-dom";


function App() {
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };
  
  return (
    <div className="App">
      <>
        <Navbar color="light" expand="md">
          <Nav navbar>
            <NavbarBrand href="/">🐕‍🦺 🐩 DeShawn's Dog Walking</NavbarBrand>
            <NavItem>
              <NavLink 
                href="/" 
                className={isActive("/") ? "active" : ""}
              >
                Dogs
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink 
                href="/walkers" 
                className={isActive("/walkers") ? "active" : ""}
              >
                Walkers
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink 
                href="/cities" 
                className={isActive("/cities") ? "active" : ""}
              >
                Cities
              </NavLink>
            </NavItem>
          </Nav>
        </Navbar>
        <Outlet />
      </>
    </div>
  );
}

export default App;
