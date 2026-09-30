import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import InputPage from './pages/InputPage';
import ProfilesPage from './pages/ProfilesPage';
import ProfileDetailPage from './pages/ProfileDetailPage';
import DatingPage from './pages/DatingPage';
import RankingsPage from './pages/RankingsPage';
import MatrixPage from './pages/MatrixPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('landing'); // 'landing' | 'profiles' | 'profile-detail' | 'input' | 'dating' | 'rankings' | 'matrix'
  const [profiles, setProfiles] = useState([]);
  const [selectedPersonId, setSelectedPersonId] = useState(null);
  const [preselectedDateId, setPreselectedDateId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load profiles from backend
  const fetchProfiles = async () => {
    try {
      const res = await fetch('/api/profiles');
      const json = await res.json();
      if (json.success && json.data) {
        setProfiles(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  // Sync tab and parameters with browser URL pathname
  const syncFromLocation = () => {
    const path = window.location.pathname;
    if (path === '/' || path === '') {
      setActiveTab('landing');
    } else if (path === '/people') {
      setActiveTab('profiles');
    } else if (path.startsWith('/people/')) {
      const id = path.replace('/people/', '').trim();
      if (id) setSelectedPersonId(id);
      setActiveTab('profile-detail');
    } else if (path === '/dates') {
      setActiveTab('dating');
    } else if (path.startsWith('/dates/')) {
      const id = path.replace('/dates/', '').trim();
      if (id) setPreselectedDateId(id);
      setActiveTab('dating');
    } else if (path === '/rankings') {
      setActiveTab('rankings');
    } else if (path.startsWith('/rankings/')) {
      const id = path.replace('/rankings/', '').trim();
      if (id) setSelectedPersonId(id);
      setActiveTab('rankings');
    } else if (path === '/matrix') {
      setActiveTab('matrix');
    } else if (path === '/add' || path === '/input') {
      setActiveTab('input');
    }
  };

  useEffect(() => {
    fetchProfiles();
    syncFromLocation();

    const handlePopState = () => {
      syncFromLocation();
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (tab, path, state = {}) => {
    setActiveTab(tab);
    if (path && window.location.pathname !== path) {
      window.history.pushState(state, '', path);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPerson = (person) => {
    const pId = typeof person === 'object' ? person.id : person;
    setSelectedPersonId(pId);
    navigateTo('profile-detail', `/people/${pId}`);
  };

  const handleStartDating = (personId, partnerId) => {
    setPreselectedDateId(personId);
    navigateTo('dating', `/dates`);
  };

  const handleWatchDate = (dateId) => {
    setPreselectedDateId(dateId);
    navigateTo('dating', `/dates/${dateId}`);
  };

  const handleNavigateToRankings = (personId) => {
    setSelectedPersonId(personId);
    navigateTo('rankings', `/rankings/${personId}`);
  };

  const handleProfileCreated = (newProfile) => {
    setProfiles((prev) => [newProfile, ...prev]);
    setSelectedPersonId(newProfile.id);
    navigateTo('profile-detail', `/people/${newProfile.id}`);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F2F2F2] flex flex-col font-sans selection:bg-[#E8472A] selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          const pathMap = {
            landing: '/',
            profiles: '/people',
            dating: '/dates',
            rankings: '/rankings',
            matrix: '/matrix',
            input: '/add'
          };
          navigateTo(tab, pathMap[tab] || '/');
        }}
        profilesCount={profiles.length}
      />

      {/* Main Page Area */}
      <main className="flex-1">
        {loading ? (
          <div className="max-w-7xl mx-auto px-4 py-32 text-center space-y-4">
            <div className="w-12 h-12 border-4 border-[#E8472A] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-mono text-slate-400">Loading autonomous agent cohort & persistent memory...</p>
          </div>
        ) : (
          <>
            {activeTab === 'landing' && (
              <LandingPage
                profiles={profiles}
                onSelectPerson={handleSelectPerson}
                onStartDating={handleStartDating}
                onNavigate={(tab) => {
                  const pathMap = {
                    landing: '/',
                    profiles: '/people',
                    dating: '/dates',
                    rankings: '/rankings',
                    matrix: '/matrix',
                    input: '/add'
                  };
                  navigateTo(tab, pathMap[tab] || '/');
                }}
              />
            )}

            {activeTab === 'profiles' && (
              <ProfilesPage
                profiles={profiles}
                onSelectPerson={handleSelectPerson}
                onStartDating={handleStartDating}
              />
            )}

            {activeTab === 'profile-detail' && selectedPersonId && (
              <ProfileDetailPage
                personId={selectedPersonId}
                onBack={() => navigateTo('profiles', '/people')}
                onStartDating={handleStartDating}
                onNavigateToRankings={handleNavigateToRankings}
                onWatchDate={handleWatchDate}
              />
            )}

            {activeTab === 'input' && (
              <InputPage 
                onProfileCreated={handleProfileCreated}
                onStartDating={handleStartDating}
              />
            )}

            {activeTab === 'dating' && (
              <DatingPage
                profiles={profiles}
                preselectedId={preselectedDateId}
                onNavigateToProfile={handleSelectPerson}
              />
            )}

            {activeTab === 'rankings' && (
              <RankingsPage
                profiles={profiles}
                onSelectPerson={handleSelectPerson}
                onStartDating={handleStartDating}
                onWatchDate={handleWatchDate}
              />
            )}

            {activeTab === 'matrix' && (
              <MatrixPage
                profiles={profiles}
                onStartDating={handleStartDating}
                onWatchDate={handleWatchDate}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={(tab) => {
        const pathMap = {
          landing: '/',
          profiles: '/people',
          dating: '/dates',
          rankings: '/rankings',
          matrix: '/matrix',
          input: '/add'
        };
        navigateTo(tab, pathMap[tab] || '/');
      }} />

    </div>
  );
}
