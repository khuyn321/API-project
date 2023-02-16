import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
// import displayHomePage from "./components/LandingPageHeader"
import SpotsIndex from "./components/SpotsIndex"
import SpotShow from "./components/SpotShow"


function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <div className='header'>
        <div id='header-navbar'>
          <Navigation isLoaded={isLoaded} />
          <hr className="navline"></hr>
        </div>
      </div >
      {isLoaded && (
        <Switch>
          <Route exact path="/">
            <SpotsIndex />
          </Route>
          <Route path="/spots/:spotId">
            <SpotShow />
          </Route>
        </Switch>
      )
      }
    </>
  );
}

export default App;