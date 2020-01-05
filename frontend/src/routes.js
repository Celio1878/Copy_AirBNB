import React, { Fragment } from "react";
import { ModalContainer } from "react-router-modal";
import "react-router-modal/css/react-router-modal.css";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import { isAuthenticated } from "./services/auth";

import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import App from "./pages/App";

const PrivateRoute = ({ component: Component, ...rest }) => (
   <Route
      {...rest}
      render = {props =>
         isAuthenticated() ? (
            <Component {...props} />
         ) : (
            <Redirect to = {{ pathname: "/", state: { from: props.location } }} />
         )
      }
   />
);

const Routes = () => (
   <BrowserRouter>
      <Fragment>
         <Switch>
            <Route exact path = "/" component = { SignIn } />
            <Route path = "/signup" component = { SignUp } />
            <PrivateRoute path = "/app" component = { App } />
            <Route path = "*" component = {() => <h1> Page NOT Found </h1>} />}
         </Switch>
         <ModalContainer>

         </ModalContainer>
      </Fragment>
   </BrowserRouter>
);

export default Routes;
