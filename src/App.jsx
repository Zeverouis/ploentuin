import './App.css'
import React from 'react'
import {Routes, Route} from 'react-router-dom';

function App() {

  return (
    <>
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/database" element={<Database/>}/>
            <Route path="/database-category" element={<Database-category/>}/>
            <Route path="/database-topic" element={<Database-topic/>}/>
            <Route path="/faq" element={<Faq/>}/>
            <Route path="/forum-category" element={<Forum-category/>}/>
            <Route path="/forum-home" element={<Forum-home/>}/>
            <Route path="/forum-topic" element={<Forum-topic/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/planner" element={<Planner/>}/>
            <Route path="/profile" element={<Profile/>}/>
            <Route path="/register" element={<Register/>}/>
        {/* maybe change these later? Want the profile to be username, topics to be the
        name of the topics/*/}
        </Routes>
      <div>

      </div>
    </>
  )
}

export default App
