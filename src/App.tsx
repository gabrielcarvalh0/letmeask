
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { Home } from "./pages/Home";
import { NewRoom } from "./pages/NewRomm";
import { Room } from './pages/Room';

import {AuthContextProvider} from './contexts/AuthContext'
import { AdminRoom } from './pages/AdminRoom';
import { UserProfile } from './pages/UserProfile';


function App() {


  return (
    <BrowserRouter>
      {/* exact fala que o endereço é exatamente esse */}
      <AuthContextProvider >
        <Switch>
        <Route path="/" exact component={Home}></Route>
        <Route path="/rooms/new"  component={NewRoom}></Route>
        <Route path="/rooms/:id"   component={Room}></Route>
        <Route path="/admin/rooms/:id"   component={AdminRoom}></Route>
        <Route path="/profile"  component={UserProfile}></Route>

        </Switch>
        </AuthContextProvider>
    </BrowserRouter>
  )
}

export default App;
