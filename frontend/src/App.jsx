import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Ministries from './pages/Ministries';
import Media from './pages/Media';
import Contact from './pages/Contact';
import Events from './pages/Events';
import Giving from './pages/Giving';
import ContactForm from './pages/ContactForm';
// About subpages
import Pastors from './pages/about/Pastors';
import Vision from './pages/about/Vision';
// Ministries subpages
import Children from './pages/ministries/Children';
import Youth from './pages/ministries/Youth';
import Men from './pages/ministries/Men';
import Women from './pages/ministries/Women';
import Couples from './pages/ministries/Couples';
import Worship from './pages/ministries/Worship';
import MediaMinistry from './pages/ministries/Media';
import Widows from './pages/ministries/Widows';
// Media subpages
import Sermons from './pages/media/Sermons';
import Announcements from './pages/media/Announcements';
import Devotionals from './pages/media/Devotionals';
import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/about/pastors" element={<Pastors />} />
        <Route path="/about/vision" element={<Vision />} />
        <Route path="/ministries" element={<Ministries />} />
        <Route path="/ministries/children" element={<Children />} />
        <Route path="/ministries/youth" element={<Youth />} />
        <Route path="/ministries/men" element={<Men />} />
        <Route path="/ministries/women" element={<Women />} />
        <Route path="/ministries/couples" element={<Couples />} />
        <Route path="/ministries/worship" element={<Worship />} />
        <Route path="/ministries/media" element={<MediaMinistry />} />
        <Route path="/ministries/widows" element={<Widows />} />
        <Route path="/media" element={<Media />} />
        <Route path="/media/sermons" element={<Sermons />} />
        <Route path="/media/announcements" element={<Announcements />} />
        <Route path="/media/devotionals" element={<Devotionals />} />
        <Route path="/events" element={<Events />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/giving" element={<Giving />} />
        <Route path="*" element={<div style={{padding: '4rem', textAlign: 'center', fontSize: '2rem'}}>Page Not Found</div>} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
