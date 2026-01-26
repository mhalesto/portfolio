import './App.css';
import Home from './pages/home';
import Projects from './pages/projects';
import Contact from './pages/contact';
import SoundframeStudio from './pages/soundframe';
import SoundframePrivacy from './pages/soundframe/privacy';
import SoundframeDataCollection from './pages/soundframe/data-collection';
import 'aos/dist/aos.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/projects' element={<Projects />} />
          <Route path='/projects/soundframe-studio' element={<SoundframeStudio />} />
          <Route path='/projects/soundframe-studio/privacy' element={<SoundframePrivacy />} />
          <Route path='/projects/soundframe-studio/data-collection' element={<SoundframeDataCollection />} />
          <Route path='/contact' element={<Contact />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
