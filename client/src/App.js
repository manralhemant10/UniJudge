import React, { useState } from 'react';
import Intro from './components/Intro'
import List from './components/List'
import styles from './App.module.css'

function App() {
  const [hack, setHack] = useState(null)

  return (
    <div id="mainContainer" className={`w-100 d-flex justify-content-center ${hack === null ? ("align-items-center") : ("")} ${styles.bigContainer}`}>
      {hack === null || hack === undefined ? (
        <Intro handleSetHack={setHack} />
      ):(
        <List hack={hack}/>
      )}
    </div>
  )
}

export default App
