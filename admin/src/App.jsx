import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Events from './pages/Events';
import Announcements from './pages/Announcements';
import Sermons from './pages/Sermons';
import Ministries from './pages/Ministries';
import Devotionals from './pages/Devotionals';
import Profile from './pages/Profile';
import Pastors from './pages/Pastors';
import Resources from './pages/Resources';
import Services from './pages/Services';
import Giving from './pages/Giving';
import GivingMethods from './pages/GivingMethods';
import MinistryCards from './pages/MinistryCards';
import ContactSubmissions from './pages/ContactSubmissions';
import Subscriptions from './pages/Subscriptions';
import Contact from './pages/Contact';
import ChurchInfo from './pages/ChurchInfo';
import HeroSlides from './pages/HeroSlides';
import ChurchMembers from './pages/ChurchMembers';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />
        
        {/* Root route - redirect to dashboard if authenticated, otherwise to login */}
        <Route path="/" element={
          <ProtectedRoute>
            <div className="flex h-screen bg-gray-100">
              <div className="flex-shrink-0">
                <Sidebar />
              </div>
              <div className="flex-1 flex flex-col min-h-0">
                <Header />
                <main className="flex-1 overflow-y-auto bg-gray-100">
                  <div className="container mx-auto px-6 py-8">
                    <Dashboard />
                  </div>
                </main>
              </div>
            </div>
          </ProtectedRoute>
        } />
        
        {/* Dashboard route */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <div className="flex h-screen bg-gray-100">
              <div className="flex-shrink-0">
                <Sidebar />
              </div>
              <div className="flex-1 flex flex-col min-h-0">
                <Header />
                <main className="flex-1 overflow-y-auto bg-gray-100">
                  <div className="container mx-auto px-6 py-8">
                    <Dashboard />
                  </div>
                </main>
              </div>
            </div>
          </ProtectedRoute>
        } />
        
        {/* Profile route */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <div className="flex h-screen bg-gray-100">
              <div className="flex-shrink-0">
                <Sidebar />
              </div>
              <div className="flex-1 flex flex-col min-h-0">
                <Header />
                <main className="flex-1 overflow-y-auto bg-gray-100">
                  <Profile />
                </main>
              </div>
            </div>
          </ProtectedRoute>
        } />
        
        {/* Users route */}
        <Route path="/users" element={
          <ProtectedRoute>
            <div className="flex h-screen bg-gray-100">
              <div className="flex-shrink-0">
                <Sidebar />
              </div>
              <div className="flex-1 flex flex-col min-h-0">
                <Header />
                <main className="flex-1 overflow-y-auto bg-gray-100">
                  <div className="container mx-auto px-6 py-8">
                    <Users />
                  </div>
                </main>
              </div>
            </div>
          </ProtectedRoute>
        } />
        
        {/* Church Members route */}
        <Route path="/church-members" element={
          <ProtectedRoute>
            <div className="flex h-screen bg-gray-100">
              <div className="flex-shrink-0">
                <Sidebar />
              </div>
              <div className="flex-1 flex flex-col min-h-0">
                <Header />
                <main className="flex-1 overflow-y-auto bg-gray-100">
                  <div className="container mx-auto px-6 py-8">
                    <ChurchMembers />
                  </div>
                </main>
              </div>
            </div>
          </ProtectedRoute>
        } />
        
        {/* Events route */}
        <Route path="/events" element={
          <ProtectedRoute>
            <div className="flex h-screen bg-gray-100">
              <div className="flex-shrink-0">
                <Sidebar />
              </div>
              <div className="flex-1 flex flex-col min-h-0">
                <Header />
                <main className="flex-1 overflow-y-auto bg-gray-100">
                  <div className="container mx-auto px-6 py-8">
                    <Events />
                  </div>
                </main>
              </div>
            </div>
          </ProtectedRoute>
        } />
        
        {/* Announcements route */}
        <Route path="/announcements" element={
          <ProtectedRoute>
            <div className="flex h-screen bg-gray-100">
              <div className="flex-shrink-0">
                <Sidebar />
              </div>
              <div className="flex-1 flex flex-col min-h-0">
                <Header />
                <main className="flex-1 overflow-y-auto bg-gray-100">
                  <div className="container mx-auto px-6 py-8">
                    <Announcements />
                  </div>
                </main>
              </div>
            </div>
          </ProtectedRoute>
        } />
        
        {/* Sermons route */}
        <Route path="/sermons" element={
          <ProtectedRoute>
            <div className="flex h-screen bg-gray-100">
              <div className="flex-shrink-0">
                <Sidebar />
              </div>
              <div className="flex-1 flex flex-col min-h-0">
                <Header />
                <main className="flex-1 overflow-y-auto bg-gray-100">
                  <div className="container mx-auto px-6 py-8">
                    <Sermons />
                  </div>
                </main>
              </div>
            </div>
          </ProtectedRoute>
        } />
        
        {/* Ministries route */}
        <Route path="/ministries" element={
          <ProtectedRoute>
            <div className="flex h-screen bg-gray-100">
              <div className="flex-shrink-0">
                <Sidebar />
              </div>
              <div className="flex-1 flex flex-col min-h-0">
                <Header />
                <main className="flex-1 overflow-y-auto bg-gray-100">
                  <div className="container mx-auto px-6 py-8">
                    <Ministries />
                  </div>
                </main>
              </div>
            </div>
          </ProtectedRoute>
        } />
        
        {/* Devotionals route */}
        <Route path="/devotionals" element={
          <ProtectedRoute>
            <div className="flex h-screen bg-gray-100">
              <div className="flex-shrink-0">
                <Sidebar />
              </div>
              <div className="flex-1 flex flex-col min-h-0">
                <Header />
                <main className="flex-1 overflow-y-auto bg-gray-100">
                  <div className="container mx-auto px-6 py-8">
                    <Devotionals />
                  </div>
                </main>
              </div>
            </div>
          </ProtectedRoute>
        } />
        
        {/* Pastors route */}
        <Route path="/pastors" element={
          <ProtectedRoute>
            <div className="flex h-screen bg-gray-100">
              <div className="flex-shrink-0">
                <Sidebar />
              </div>
              <div className="flex-1 flex flex-col min-h-0">
                <Header />
                <main className="flex-1 overflow-y-auto bg-gray-100">
                  <div className="container mx-auto px-6 py-8">
                    <Pastors />
                  </div>
                </main>
              </div>
            </div>
          </ProtectedRoute>
        } />
        
        {/* Resources route */}
        <Route path="/resources" element={
          <ProtectedRoute>
            <div className="flex h-screen bg-gray-100">
              <div className="flex-shrink-0">
                <Sidebar />
              </div>
              <div className="flex-1 flex flex-col min-h-0">
                <Header />
                <main className="flex-1 overflow-y-auto bg-gray-100">
                  <div className="container mx-auto px-6 py-8">
                    <Resources />
                  </div>
                </main>
              </div>
            </div>
          </ProtectedRoute>
        } />
        
        {/* Services route */}
        <Route path="/services" element={
          <ProtectedRoute>
            <div className="flex h-screen bg-gray-100">
              <div className="flex-shrink-0">
                <Sidebar />
              </div>
              <div className="flex-1 flex flex-col min-h-0">
                <Header />
                <main className="flex-1 overflow-y-auto bg-gray-100">
                  <div className="container mx-auto px-6 py-8">
                    <Services />
                  </div>
                </main>
              </div>
            </div>
          </ProtectedRoute>
        } />
        
        {/* Giving route */}
        <Route path="/giving" element={
          <ProtectedRoute>
            <div className="flex h-screen bg-gray-100">
              <div className="flex-shrink-0">
                <Sidebar />
              </div>
              <div className="flex-1 flex flex-col min-h-0">
                <Header />
                <main className="flex-1 overflow-y-auto bg-gray-100">
                  <div className="container mx-auto px-6 py-8">
                    <Giving />
                  </div>
                </main>
              </div>
            </div>
          </ProtectedRoute>
        } />
        
        {/* Giving Methods route */}
        <Route path="/giving-methods" element={
          <ProtectedRoute>
            <div className="flex h-screen bg-gray-100">
              <div className="flex-shrink-0">
                <Sidebar />
              </div>
              <div className="flex-1 flex flex-col min-h-0">
                <Header />
                <main className="flex-1 overflow-y-auto bg-gray-100">
                  <div className="container mx-auto px-6 py-8">
                    <GivingMethods />
                  </div>
                </main>
              </div>
            </div>
          </ProtectedRoute>
        } />
        
        {/* Ministry Cards route */}
        <Route path="/ministry-cards" element={
          <ProtectedRoute>
            <div className="flex h-screen bg-gray-100">
              <div className="flex-shrink-0">
                <Sidebar />
              </div>
              <div className="flex-1 flex flex-col min-h-0">
                <Header />
                <main className="flex-1 overflow-y-auto bg-gray-100">
                  <div className="container mx-auto px-6 py-8">
                    <MinistryCards />
                  </div>
                </main>
              </div>
            </div>
          </ProtectedRoute>
        } />
        
        {/* Contact Submissions route */}
        <Route path="/contact-submissions" element={
          <ProtectedRoute>
            <div className="flex h-screen bg-gray-100">
              <div className="flex-shrink-0">
                <Sidebar />
              </div>
              <div className="flex-1 flex flex-col min-h-0">
                <Header />
                <main className="flex-1 overflow-y-auto bg-gray-100">
                  <div className="container mx-auto px-6 py-8">
                    <ContactSubmissions />
                  </div>
                </main>
              </div>
            </div>
          </ProtectedRoute>
        } />
        
        {/* Subscriptions route */}
        <Route path="/subscriptions" element={
          <ProtectedRoute>
            <div className="flex h-screen bg-gray-100">
              <div className="flex-shrink-0">
                <Sidebar />
              </div>
              <div className="flex-1 flex flex-col min-h-0">
                <Header />
                <main className="flex-1 overflow-y-auto bg-gray-100">
                  <div className="container mx-auto px-6 py-8">
                    <Subscriptions />
                  </div>
                </main>
              </div>
            </div>
          </ProtectedRoute>
        } />
        
        {/* Contact route */}
        <Route path="/contact" element={
          <ProtectedRoute>
            <div className="flex h-screen bg-gray-100">
              <div className="flex-shrink-0">
                <Sidebar />
              </div>
              <div className="flex-1 flex flex-col min-h-0">
                <Header />
                <main className="flex-1 overflow-y-auto bg-gray-100">
                  <div className="container mx-auto px-6 py-8">
                    <Contact />
                  </div>
                </main>
              </div>
            </div>
          </ProtectedRoute>
        } />
        
        {/* Church Info route */}
        <Route path="/church-info" element={
          <ProtectedRoute>
            <div className="flex h-screen bg-gray-100">
              <div className="flex-shrink-0">
                <Sidebar />
              </div>
              <div className="flex-1 flex flex-col min-h-0">
                <Header />
                <main className="flex-1 overflow-y-auto bg-gray-100">
                  <div className="container mx-auto px-6 py-8">
                    <ChurchInfo />
                  </div>
                </main>
              </div>
            </div>
          </ProtectedRoute>
        } />
        
        {/* Hero Slides route */}
        <Route path="/hero-slides" element={
          <ProtectedRoute>
            <div className="flex h-screen bg-gray-100">
              <div className="flex-shrink-0">
                <Sidebar />
              </div>
              <div className="flex-1 flex flex-col min-h-0">
                <Header />
                <main className="flex-1 overflow-y-auto bg-gray-100">
                  <div className="container mx-auto px-6 py-8">
                    <HeroSlides />
                  </div>
                </main>
              </div>
            </div>
          </ProtectedRoute>
        } />
        
        {/* Catch-all route - redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
