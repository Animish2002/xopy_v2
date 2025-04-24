import React from "react";
import { motion } from "framer-motion";
import { FaGithub, FaTwitter, FaInstagram } from "react-icons/fa";
import logo from "../assets/xopyLogo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  // Animation variants
  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: "easeOut" 
      }
    }
  };

  const linkVariants = {
    hover: {
      y: -2,
      transition: { type: "spring", stiffness: 300 }
    }
  };

  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={footerVariants}
      className="relative mt-20"
    >
      {/* Decorative top wave */}
      <div className="absolute top-0 left-0 right-0 transform -translate-y-full overflow-hidden">
        <svg 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="relative block w-full h-12 text-yellow-50 dark:text-gray-800 fill-current"
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C0,0,0,138.53,321.39,56.44Z"></path>
        </svg>
      </div>

      <div className="bg-yellow-50 dark:bg-gray-800 pt-16 pb-8">
        <div className="container mx-auto px-4">
          {/* Main Footer Content */}
          <div className="flex flex-col md:flex-row justify-between mb-12">
            {/* Logo and Description */}
            <div className="mb-10 md:mb-0 md:w-1/3">
              <div className="flex items-center mb-4">
                <img src={logo} className="w-32" />
              </div>
              <p className="text-gray-600 dark:text-gray-300 max-w-md mb-4 px-4">
                Your secure file sharing solution. Fast, reliable, and designed with privacy in mind.
              </p>
              <div className="flex space-x-4 px-4">
                <motion.a 
                  href="#" 
                  className="text-gray-500 hover:text-yellow-500 dark:text-gray-400 dark:hover:text-yellow-400"
                  variants={linkVariants}
                  whileHover="hover"
                >
                  <FaTwitter size={20} />
                </motion.a>
                <motion.a 
                  href="#" 
                  className="text-gray-500 hover:text-yellow-500 dark:text-gray-400 dark:hover:text-yellow-400"
                  variants={linkVariants}
                  whileHover="hover"
                >
                  <FaGithub size={20} />
                </motion.a>
                <motion.a 
                  href="#" 
                  className="text-gray-500 hover:text-yellow-500 dark:text-gray-400 dark:hover:text-yellow-400"
                  variants={linkVariants}
                  whileHover="hover"
                >
                  <FaInstagram size={20} />
                </motion.a>
              </div>
            </div>

            {/* Footer Links */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-gray-800 dark:text-white font-semibold mb-4">Product</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors">Features</a></li>
                  <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors">Pricing</a></li>
                  <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors">Security</a></li>
                  <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors">FAQ</a></li>
                </ul>
              </div>
              
            </div>
          </div>

          {/* Newsletter - Optional */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-8 pb-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 md:mb-0">
                © {currentYear} Xopy. All rights reserved.
              </p>
             
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;