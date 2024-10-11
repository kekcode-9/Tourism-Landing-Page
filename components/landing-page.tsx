'use client';
import React, { useContext, useEffect, useState } from 'react';
import { TourismContext } from '@/store/tourismStore';
import Navbar from './common-components/navbar';
import EntryLandingPage from './entry-landing-page';
import Places from './landing-page-places';
import Adventures from './adventures';
import Footer from './footer';
import CloudAnimation from './cloud-animation-lottie';

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
    </>
  )
}
