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

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleSelectPerson = (person) => {
    setSelectedPersonId(person.id);
    setActiveTab('profile-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartDating = (personId, partnerId) => {
    setPreselectedDateId(personId);
    setActiveTab('dating');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWatchDate = (dateId) => {
    setActiveTab('dating');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToRankings = (personId) => {
    setSelectedPersonId(personId);
    setActiveTab('rankings');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProfileCreated = (newProfile) => {
    setProfiles((prev) => [newProfile, ...prev]);
    setSelectedPersonId(newProfile.id);
    setActiveTab('profile-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F2F2F2] flex flex-col font-sans selection:bg-[#E8472A] selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
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
                  setActiveTab(tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
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
                onBack={() => setActiveTab('profiles')}
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
        setActiveTab(tab);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }} />

    </div>
  );
}
