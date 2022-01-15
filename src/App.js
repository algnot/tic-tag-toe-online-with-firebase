import React , {useEffect , useState} from 'react';
import './App.css';

import queryString from 'query-string'
import Home from './Page/home/Home';
import SetName from './component/setName/setName';
import Game from './Page/game/Game';

function App() {
  const parsed = queryString.parse(window.location.search); 
  
  const [userName, setuserName] = useState('')
  const [userKey, setuserKey] = useState('')
  const [page, setPage] = useState('')

  useEffect(() => {
    var userKey = localStorage.getItem('key')
    var userName = localStorage.getItem('name')
    if(!userKey) {
      const generateKey = Math.floor(Math.random() * 999999999 + 100000000);
      localStorage.setItem('key' , generateKey)
      userKey = generateKey
      setuserKey(generateKey)
    }
    setuserName(userName ? userName : '')
    setuserKey(userKey)
    setPage(parsed.page ? parsed.page : 'home')
  }, [])

  return (
    <div className="App">
      {
        !userName && <SetName setUserName={setuserName} />
      }
      {
        page == 'home' &&
        <Home />
      }
      {
        page == 'game' &&
        <Game />
      }
    </div>
  );
}

export default App;
