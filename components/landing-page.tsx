'use client';
import React, { useContext, useEffect, useState } from 'react';
import { TourismContext } from '@/store/tourismStore';
import Navbar from './common-components/navbar';
import EntryLandingPage from './entry-landing-page';
import Places from './landing-page-places';
import PlacesToVisit from './places-to-visit';
import Adventures from './adventures';

export default function LandingPage() {
  const { state } = useContext(TourismContext);
  const { placesScrollPos, showEntry, showAdventures } = state;


  return (
    <>
      {
        !showEntry && 
        <Navbar/>
      }
      <EntryLandingPage showPage={showEntry} />
      {
        (!showEntry && !showAdventures) && <Places/>
      }
      {
        (placesScrollPos === 'end' && showAdventures) &&
        <Adventures/>
      }
      {
        // placesScrollPos === 'end' &&
        // <div className='relative w-screen h-screen bg-black'></div>
      }
    </>
  )
}
