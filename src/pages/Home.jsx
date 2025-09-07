import React from 'react';
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection';
import CoursesSection from '../components/CoursesSection';

const Home = () => {
  return (
    <div>
      <Navbar />
      <main>
        <HeroSection />
        <CoursesSection />
      </main>
      
    </div>
  );
};

export default Home;