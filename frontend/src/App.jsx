import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import InputPage from './pages/InputPage';
import ProfilesPage from './pages/ProfilesPage';
import ProfileDetailPage from './pages/ProfileDetailPage';
import DatingPage from './pages/DatingPage';
import RankingsPage from './pages/RankingsPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('landing'); // 'landing' | 'profiles' | 'profile-detail' | 'input' | 'dating' | 'rankings'
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

  const handleStartDating = (personId) => {
    setPreselectedDateId(personId);
    setActiveTab('dating');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProfileCreated = (newProfile) => {
    setProfiles((prev) => [newProfile, ...prev]);
    setSelectedPersonId(newProfile.id);
    setActiveTab('profile-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-midnight-950 text-slate-100 flex flex-col font-sans selection:bg-roseNeon-500 selection:text-white">
      
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
            <div className="w-12 h-12 border-4 border-roseNeon-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-mono text-slate-400">Initializing autonomous agents and persistent memory...</p>
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
              />
            )}

            {activeTab === 'input' && (
              <InputPage onProfileCreated={handleProfileCreated} />
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
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}
