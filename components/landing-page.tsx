'use client';
import React, { useContext, useEffect, useState } from 'react';
import { TourismContext } from '@/store/tourismStore';
import Navbar from './common-components/navbar';
import EntryLandingPage from './entry-landing-page';
import Places from './landing-page-places';
import EventsPage from './events';

export default function LandingPage() {
  const { state } = useContext(TourismContext);
  const { placesScrollPos, showEntry } = state;


  return (
    <>
      {
        !showEntry && <Navbar/>
      }
      <EntryLandingPage showPage={showEntry} />
      {
        !showEntry && <Places/>
      }
      {
        placesScrollPos === 'end' &&
        <EventsPage/>
      }
    </>
  )
}
