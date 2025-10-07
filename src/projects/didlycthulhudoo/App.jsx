import React, { useState } from 'react';
import './index.css';
import Header from './Header';
import Home from './Home';
import Event from './Event';
import CreateEvent from './CreateEvent';
import NoPage from './NoPage';

export default function DidlyApp() {
  const [currentView, setCurrentView] = useState({ view: 'home' });

  const navigateToHome = () => setCurrentView({ view: 'home' });
  const navigateToCreate = () => setCurrentView({ view: 'create' });
  const navigateToEvent = (eventId) => setCurrentView({ view: 'event', id: eventId });
  const navigateTo404 = () => setCurrentView({ view: '404' });

  const renderCurrentView = () => {
    switch (currentView.view) {
      case 'create':
        return <CreateEvent onEventCreated={navigateToEvent} onHomeClick={navigateToHome} />;
      case 'event':
        return <Event eventId={currentView.id} />;
      case '404':
        return <NoPage />;
      case 'home':
      default:
        return <Home onEventClick={navigateToEvent} />;
    }
  };

  return (
    <>
      <Header
        onHomeClick={navigateToHome}
        onCreateClick={navigateToCreate}
        on404Click={navigateTo404}
      />
      <main>
        {renderCurrentView()}
      </main>
    </>
  );
}