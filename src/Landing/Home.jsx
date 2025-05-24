import React from "react";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import Mission from "./Mission";
import Team from "./Team";
import XopyFeatures from "./Features";
import Footer from "./Footer";
import ContactUs from "./ContactUs";
// import Pricing from "./Pricing";

const Home = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <Mission />
      <XopyFeatures />
      {/* <Team /> */}
      {/* <Pricing /> */}
      <ContactUs />
      <Footer />
    </div>
  );
};

export default Home;
