import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from "./home/home"
import Login from "./login"
import Register from "./register"
import Body from "./home/body_content"

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Home />}>
                    <Route path="/:pageId/*" element={<Body />} />
                </Route>
            </Routes>
        </Router>
    )
}
export default App;