import './App.css';
import ChatbotWidget from './components/chatbot.js';
import Input from './components/input.js';
import TopBar from './components/navbar.js';
import News from './components/news.js';
import SearchBar from './components/search.js';

// NEW IMPORTS
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import About from "./pages/About.js";
import Dashboard from "./pages/Dashboard.js";

function App() {
  return (
    <Router>
      <div className="App">

        {/* LEFT SIDE */}
        <div className='body-left'>
          <div className='navbar'>
            <TopBar />
          </div>

          {/* ROUTES INSIDE LEFT SIDE */}
          <Routes>
            <Route path="/" element={
              <>
                <Input />
                <News />
              </>
            } />

            <Route path="/about" element={<About />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>

        {/* RIGHT SIDE (ALWAYS VISIBLE) */}
        <div className='body-right'>
          <SearchBar />
          <ChatbotWidget />
        </div>

      </div>
    </Router>
  );
}

export default App;