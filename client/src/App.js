import React from 'react';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';

import ChatPage from './Pages/ChatPage';
import JoinPage from './Pages/JoinPage';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" component={JoinPage} exact />
        <Route path="/chat" component={ChatPage} exact />
        <Redirect to="/" exact />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
