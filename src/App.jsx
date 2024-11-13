import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import {NotificationContainer} from 'react-notifications';

import Application from "./Routes";
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <Application/>
     <NotificationContainer/>
    </>
  )
}

export default App
