import React from "react";
import { motion } from "framer-motion";
import Animish from "../assets/Animish.jpeg";
import Anushka from "../assets/Anushka.jpeg";
import Vrushabh from "../assets/Vrushabh.jpeg";
import { FaLinkedin, FaEnvelope } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Team = () => {
  const teamMembers = [
    {
      name: "Animish Chopade",
      image: Animish,
      email: "animishchopade123@gmail.com",
      linkedin: "https://www.linkedin.com/in/animish-chopade/",
      twitter: "https://x.com/animish06",
      role: "Co-Founder & Lead Developer"
    },
    {
      name: "Anushka Bhosale",
      image: Anushka,
      email: "anushkaabhosale@gmail.com",
      linkedin: "https://www.linkedin.com/in/anushkabhosale/",
      twitter: "https://x.com/pr3cious_ly/",
      role: "Co-Founder & Design Lead"
    },
    {
      name: "Vrushabh Kulkarni",
      image: Vrushabh,
      email: "vrushabhkulkarni@gmail.com",
      linkedin: "https://www.linkedin.com/in/vrushabhskulkarni/",
      twitter: "https://x.com/vrushabhsk",
      role: "Co-Founder & Product Strategist"
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeInOut",
      },
    },
  };

  return (
    <section id="team" className="py-20 relative overflow-hidden">
      {/* Background decorative elements  bg-gradient-to-b from-yellow-50 to-white dark:from-gray-900 dark:to-gray-800*/}
      <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      
      {/* Subtle honeycomb pattern */}
      <div className="absolute inset-0 bg-honeycomb-pattern opacity-5"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Team Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={titleVariants}
        >
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 rounded-full">
            Our Team
          </span>
          <h2 className="ui text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 to-amber-500 dark:from-yellow-400 dark:to-amber-300">
            Meet the Team
          </h2>
          <div className="w-20 h-1 bg-yellow-400 mx-auto mb-6 rounded-full"></div>
          <p className="max-w-2xl mx-auto text-gray-700 dark:text-gray-300 text-lg">
            The talented people behind Xopy who are dedicated to making file sharing simple and secure.
          </p>
        </motion.div>

        {/* Team Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
        >
          {teamMembers.map((member, index) => (
            <TeamMember key={index} member={member} index={index} variants={itemVariants} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const TeamMember = ({ member, variants }) => {
  const { name, image, email, linkedin, twitter, role } = member;

  const socialIconVariants = {
    hover: {
      y: -5,
      transition: { type: "spring", stiffness: 300 }
    }
  };

  return (
    <motion.div 
      className="relative"
      variants={variants}
      whileHover={{ y: -10 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      {/* Card with custom shadow */}
      <div className="rounded-xl overflow-hidden border border-yellow-200 dark:border-yellow-900/30 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800">
        <div className="p-6 flex flex-col items-center h-full">
          {/* Yellow accent at the top */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-amber-500"></div>
          
          {/* Profile Image with Ring */}
          <div className="relative w-40 h-40 mb-6">
            <div className="absolute inset-0 bg-yellow-300 rounded-full opacity-20 blur-md"></div>
            <div className="relative w-full h-full rounded-full p-1 bg-gradient-to-r from-yellow-500 to-amber-400">
              <div className="w-full h-full rounded-full overflow-hidden bg-gray-200">
                <img
                  src={image}
                  alt={name}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </div>

          {/* Member Details */}
          <h3 className="text-xl font-bold mb-1 text-gray-800 dark:text-white">{name}</h3>
          <p className="text-yellow-600 dark:text-yellow-400 mb-4 text-sm">{role}</p>
          
          {/* Divider */}
          <div className="w-12 h-0.5 bg-yellow-200 dark:bg-yellow-800 mb-4"></div>
          
          {/* Social Links */}
          <div className="flex gap-3 mt-2">
            <motion.a
              href={`mailto:${email}`}
              className="w-10 h-10 rounded-full bg-yellow-50 hover:bg-yellow-100 dark:bg-gray-700 dark:hover:bg-yellow-900/30 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
              variants={socialIconVariants}
              whileHover="hover"
              aria-label={`Email ${name}`}
            >
              <FaEnvelope size={18} />
            </motion.a>
            <motion.a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-yellow-50 hover:bg-yellow-100 dark:bg-gray-700 dark:hover:bg-yellow-900/30 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
              variants={socialIconVariants}
              whileHover="hover"
              aria-label={`LinkedIn profile of ${name}`}
            >
              <FaLinkedin size={18} />
            </motion.a>
            <motion.a
              href={twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-yellow-50 hover:bg-yellow-100 dark:bg-gray-700 dark:hover:bg-yellow-900/30 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
              variants={socialIconVariants}
              whileHover="hover"
              aria-label={`Twitter profile of ${name}`}
            >
              <FaXTwitter size={18} />
            </motion.a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Add CSS for honeycomb pattern
const style = document.createElement("style");
style.textContent = `
  .bg-honeycomb-pattern {
    background-image: radial-gradient(circle, rgba(252, 211, 77, 0.1) 1px, transparent 1px);
    background-size: 20px 20px;
  }
  
  @media (prefers-color-scheme: dark) {
    .bg-honeycomb-pattern {
      background-image: radial-gradient(circle, rgba(252, 211, 77, 0.05) 1px, transparent 1px);
    }
  }
`;
document.head.appendChild(style);

export default Team;