'use client';
import React from 'react';
import Navbar from './common-components/navbar';
import EntryLandingPage from './entry-landing-page';
import Places from './landing-page-places';

export default function LandingPage() {
  return (
    <>
      <Navbar/>
      {/* <EntryLandingPage/> */}
      <Places/>
    </>
  )
}
