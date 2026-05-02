import './App.css';
import Home from './pages/home';
import Projects from './pages/projects';
import Contact from './pages/contact';
import SoundframeStudio from './pages/soundframe';
import SoundframePrivacy from './pages/soundframe/privacy';
import SoundframeDataCollection from './pages/soundframe/data-collection';
import SoundframeIOS from './pages/soundframe-ios';
import SoundframeIOSPrivacy from './pages/soundframe-ios/privacy';
import SoundframeIOSDataCollection from './pages/soundframe-ios/data-collection';
import LifeTrackIOS from './pages/lifetrack-ios';
import LifeTrackIOSPrivacy from './pages/lifetrack-ios/privacy';
import LifeTrackIOSDataCollection from './pages/lifetrack-ios/data-collection';
import YouMineIOS from './pages/youmine-ios';
import YouMineIOSPrivacy from './pages/youmine-ios/privacy';
import YouMineIOSDataCollection from './pages/youmine-ios/data-collection';
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
          <Route path='/projects/soundframe-ios' element={<SoundframeIOS />} />
          <Route path='/projects/soundframe-ios/privacy' element={<SoundframeIOSPrivacy />} />
          <Route path='/projects/soundframe-ios/data-collection' element={<SoundframeIOSDataCollection />} />
          <Route path='/projects/lifetrack-ios' element={<LifeTrackIOS />} />
          <Route path='/projects/lifetrack-ios/privacy' element={<LifeTrackIOSPrivacy />} />
          <Route path='/projects/lifetrack-ios/data-collection' element={<LifeTrackIOSDataCollection />} />
          <Route path='/projects/youmine-ios' element={<YouMineIOS />} />
          <Route path='/projects/youmine-ios/privacy' element={<YouMineIOSPrivacy />} />
          <Route path='/projects/youmine-ios/data-collection' element={<YouMineIOSDataCollection />} />
          <Route path='/contact' element={<Contact />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
