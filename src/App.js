import './App.css';
import ChatbotWidget from './components/chatbot.js';
import Input from './components/input.js';
import TopBar from './components/navbar.js';
import News from './components/news.js';
import SearchBar from './components/search.js';

function App() {
  return (
    <div className="App">
      <div className='body-left'>
        <div className='navbar'>
        <TopBar />
        </div>
        <Input/>
        <News/>
      </div>
      <div className='body-right'>
        <SearchBar/>
      </div>
    </div>
  );
}

export default App;
