import React, { useState, useEffect } from 'react';
import { Opportunity, UserProfile, SavedOpportunity, NotificationItem, AIStatus } from './types';
import { api } from './services/api';

import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { OpportunityModal } from './components/OpportunityModal';
import { ReminderModal } from './components/ReminderModal';

import { Dashboard } from './pages/Dashboard';
import { Discover } from './pages/Discover';
import { Recommendations } from './pages/Recommendations';
import { ClosingSoon } from './pages/ClosingSoon';
import { ChatPage } from './pages/ChatPage';
import { SavedPage } from './pages/SavedPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';
import { AboutPage } from './pages/AboutPage';

export function App() {
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Core Data States
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [recommendations, setRecommendations] = useState<Opportunity[]>([]);
  const [dontMiss, setDontMiss] = useState<Opportunity[]>([]);
  const [closingSoon, setClosingSoon] = useState<Opportunity[]>([]);
  const [savedList, setSavedList] = useState<SavedOpportunity[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [aiStatus, setAiStatus] = useState<AIStatus | null>(null);

  // Modals
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [reminderModalOp, setReminderModalOp] = useState<Opportunity | null>(null);

  // Navigation Filter Context
  const [discoverInitialSearch, setDiscoverInitialSearch] = useState<string>('');
  const [discoverInitialTopic, setDiscoverInitialTopic] = useState<string>('All');

  // Load all foundational data
  const loadInitialData = async () => {
    try {
      const [profData, opData, recData, missData, soonData, savedData, notifData, aiData] = await Promise.all([
        api.getProfile(),
        api.getOpportunities(),
        api.getRecommendations(),
        api.getDontMiss(),
        api.getClosingSoon(),
        api.getSaved(),
        api.getNotifications(),
        api.getAiStatus()
      ]);

      setProfile(profData);
      setOpportunities(opData);
      setRecommendations(recData);
      setDontMiss(missData);
      setClosingSoon(soonData);
      setSavedList(savedData);
      setNotifications(notifData);
      setAiStatus(aiData);
    } catch (err) {
      console.error("Error loading TechPulse data:", err);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Save / Bookmark Handler
  const handleToggleSave = async (op: Opportunity) => {
    if (op.is_saved) {
      try {
        await api.unsaveOpportunity(op.id);
        await loadInitialData();
      } catch (e) {
        console.error(e);
      }
    } else {
      // Open reminder modal to configure alert timing
      setReminderModalOp(op);
    }
  };

  const handleConfirmSaveReminder = async (opportunityId: number, daysBefore: number) => {
    try {
      await api.saveOpportunity(opportunityId, daysBefore);
      await loadInitialData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleUnsave = async (opportunityId: number) => {
    try {
      await api.unsaveOpportunity(opportunityId);
      await loadInitialData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateReminderDays = async (opportunityId: number, days: number) => {
    try {
      await api.updateReminderDays(opportunityId, days);
      await loadInitialData();
    } catch (e) {
      console.error(e);
    }
  };

  // Notification actions
  const handleMarkNotifRead = async (id: number) => {
    try {
      await api.markNotificationRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAllNotifsRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteNotif = async (id: number) => {
    try {
      await api.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectOpportunityById = async (id: number) => {
    try {
      const op = await api.getOpportunityDetails(id);
      setSelectedOpportunity(op);
    } catch (e) {
      console.error(e);
    }
  };

  // Registration actions
  const handleTrackRegistration = async (opId: number) => {
    try {
      await api.trackRegistration(opId);
    } catch (e) {
      console.error("Failed to track registration event:", e);
    }
  };

  const handleToggleMarkRegistered = async (opId: number) => {
    try {
      const res = await api.markRegistered(opId);
      const updateList = (list: Opportunity[]) =>
        list.map((o) => (o.id === opId ? { ...o, is_user_registered: res.is_registered } : o));

      setOpportunities(updateList);
      setRecommendations(updateList);
      setDontMiss(updateList);
      setClosingSoon(updateList);
      if (selectedOpportunity && selectedOpportunity.id === opId) {
        setSelectedOpportunity({
          ...selectedOpportunity,
          is_user_registered: res.is_registered
        });
      }
    } catch (e) {
      console.error("Failed to toggle mark registered:", e);
    }
  };

  // Profile actions
  const handleUpdateProfile = async (updated: Partial<UserProfile>) => {
    await api.updateProfile(updated);
    await loadInitialData();
  };

  const handleResetCieDemo = async () => {
    await api.resetCieDemoProfile();
    await loadInitialData();
  };

  // Navigation with filter parameters
  const handleNavigate = (view: string, filterParams?: any) => {
    setCurrentView(view);
    if (filterParams?.topic) {
      setDiscoverInitialTopic(filterParams.topic);
    }
  };

  const handleGlobalSearch = (query: string) => {
    setDiscoverInitialSearch(query);
    setCurrentView('discover');
  };

  const urgentOpportunitiesCount = closingSoon.filter((o) => [1, 2].includes(o.urgency_rank)).length;

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navbar */}
      <Navbar
        profile={profile}
        notifications={notifications}
        aiStatus={aiStatus}
        onSearch={handleGlobalSearch}
        onNavigate={handleNavigate}
        onMarkRead={handleMarkNotifRead}
        onMarkAllRead={handleMarkAllNotifsRead}
        onDeleteNotification={handleDeleteNotif}
        onSelectOpportunity={handleSelectOpportunityById}
        onToggleMobileMenu={() => setMobileMenuOpen(true)}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Navigation Sidebar */}
        <Sidebar
          currentView={currentView}
          onNavigate={handleNavigate}
          savedCount={savedList.length}
          urgentCount={urgentOpportunitiesCount}
          onResetCieDemo={handleResetCieDemo}
          isOpenMobile={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Dynamic View Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden min-w-0">
          {currentView === 'dashboard' && (
            <Dashboard
              profile={profile}
              opportunities={opportunities}
              recommendations={recommendations}
              dontMiss={dontMiss}
              closingSoon={closingSoon}
              savedCount={savedList.length}
              onViewDetails={setSelectedOpportunity}
              onToggleSave={handleToggleSave}
              onNavigate={handleNavigate}
              onTrackRegistration={handleTrackRegistration}
              onToggleMarkRegistered={handleToggleMarkRegistered}
            />
          )}

          {currentView === 'discover' && (
            <Discover
              initialSearch={discoverInitialSearch}
              initialTopic={discoverInitialTopic}
              onViewDetails={setSelectedOpportunity}
              onToggleSave={handleToggleSave}
              onTrackRegistration={handleTrackRegistration}
              onToggleMarkRegistered={handleToggleMarkRegistered}
              fetchOpportunities={api.getOpportunities}
            />
          )}

          {currentView === 'recommendations' && (
            <Recommendations
              profile={profile}
              recommendations={recommendations}
              onViewDetails={setSelectedOpportunity}
              onToggleSave={handleToggleSave}
              onTrackRegistration={handleTrackRegistration}
            />
          )}

          {currentView === 'closing_soon' && (
            <ClosingSoon
              closingSoon={closingSoon}
              onViewDetails={setSelectedOpportunity}
              onToggleSave={handleToggleSave}
              onTrackRegistration={handleTrackRegistration}
            />
          )}

          {currentView === 'chat' && (
            <ChatPage
              onViewDetails={setSelectedOpportunity}
              onToggleSave={handleToggleSave}
              onTrackRegistration={handleTrackRegistration}
            />
          )}

          {currentView === 'saved' && (
            <SavedPage
              savedList={savedList}
              onViewDetails={setSelectedOpportunity}
              onUnsave={handleUnsave}
              onUpdateReminderDays={handleUpdateReminderDays}
              onNavigate={handleNavigate}
            />
          )}

          {currentView === 'profile' && (
            <ProfilePage
              profile={profile}
              onUpdateProfile={handleUpdateProfile}
              onResetCieDemo={handleResetCieDemo}
            />
          )}

          {currentView === 'admin' && (
            <AdminPage
              opportunities={opportunities}
              aiStatus={aiStatus}
              onRefreshData={loadInitialData}
              onRefreshAiStatus={async () => {
                const s = await api.getAiStatus();
                setAiStatus(s);
              }}
            />
          )}

          {currentView === 'about' && (
            <AboutPage
              onNavigate={handleNavigate}
              onResetCieDemo={handleResetCieDemo}
            />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <OpportunityModal
        opportunity={selectedOpportunity}
        onClose={() => setSelectedOpportunity(null)}
        onToggleSave={handleToggleSave}
        onTrackRegistration={handleTrackRegistration}
        onToggleMarkRegistered={handleToggleMarkRegistered}
      />

      <ReminderModal
        opportunity={reminderModalOp}
        isOpen={reminderModalOp !== null}
        onClose={() => setReminderModalOp(null)}
        onSaveReminder={handleConfirmSaveReminder}
      />
    </div>
  );
}

export default App;
