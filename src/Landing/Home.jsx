import React from "react";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import Mission from "./Mission";
import Team from "./Team";
import XopyFeatures from "./Features";
import Footer from "./Footer";

const Home = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <Mission />
      <XopyFeatures />
      <Team />

      <Footer />
    </div>
  );
};

export default Home;
