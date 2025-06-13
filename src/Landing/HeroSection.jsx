import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import SideImage from "../assets/landingPage1.png";
import { Link, useNavigate } from "react-router-dom";

// Import shadcn components
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { ChevronRight, Download, ArrowRight, Star } from "lucide-react";

const HeroSection = () => {
  const [loaded, setLoaded] = useState(false);
  const { scrollY } = useScroll();

  // Parallax effect on scroll
  const imageY = useTransform(scrollY, [0, 500], [0, 50]);
  const textY = useTransform(scrollY, [0, 300], [0, -30]);

  useEffect(() => {
    // Set loaded after component mount to trigger animations
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Text animation variants
  const titleContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.2,
        duration: 1,
      },
    },
  };

  const titleLine = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const wordAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.08,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  const buttonContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.8,
        staggerChildren: 0.2,
      },
    },
  };

  const buttonItem = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const imageContainer = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.4,
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.6,
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };
 
  const text1 = "No More WhatsApp or Email.";
  const text2 = "Share Files Securely for Printing.";
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowText(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const typingAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const letterAnimation = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <div className="relative overflow-hidden py-20 md:py-24 lg:py-32 ">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-amber-50 dark:from-slate-900 dark:to-slate-800" />
      <div className="mx-auto px-6 md:max-w-11/12 md:mt-0 mt-7">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[70vh]">
          {/* Text Content Section */}
          <motion.div className="flex flex-col z-10" style={{ y: textY }}>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Badge
                variant="outline"
                className="mb-6 py-1.5 px-4 text-sm font-medium rounded-full w-fit bg-white/70 backdrop-blur-sm border-yellow-200"
              >
                <Star className="mr-1 h-3.5 w-3.5 text-yellow-500" />
                <span> Encrypted File Sharing</span>
              </Badge>
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="text-4xl md:text-4xl lg:text-[3.2rem] font-bold tracking-tight mb-6 ui"
              variants={titleContainer}
              initial="hidden"
              animate={loaded ? "visible" : "hidden"}
            >
              {showText ? (
                <motion.div
                  className="flex flex-col justify-center"
                  variants={typingAnimation}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="px-1.5 md:px-0">
                    {text1.split("").map((char, index) => (
                      <motion.span
                        key={`line1-${index}`}
                        variants={letterAnimation}
                      >
                        {char === " " ? "\u00A0" : char}
                      </motion.span>
                    ))}
                  </div>
                  <div>
                    {text2.split("").map((char, index) => (
                      <motion.span
                        key={`line2-${index}`}
                        variants={letterAnimation}
                      >
                        {char === " " ? "\u00A0" : char}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <></>
              )}
            </motion.h1>

            {/* Description */}
            <motion.p
              className="text-base md:text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-lg"
              variants={fadeIn}
              initial="hidden"
              animate={loaded ? "visible" : "hidden"}
            >
             Upload your documents directly via QR code. End-to-end encryption. No local copies. Complete privacy and control.
            </motion.p>

            {/* Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 mb-8"
              variants={buttonContainer}
              initial="hidden"
              animate={loaded ? "visible" : "hidden"}
            >
              <motion.div variants={buttonItem}>
                <Button
                  size="lg"
                  className="w-full sm:w-auto gap-2 px-8 rounded-full font-medium"
                >
                  <Link to="/auth/signin">Get Started</Link>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </motion.div>

              <motion.div variants={buttonItem}>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto gap-2 px-8 rounded-full font-medium border-slate-300 dark:border-slate-700"
                >
                  How it works
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-3 gap-4 max-w-md"
              variants={fadeIn}
              initial="hidden"
              animate={loaded ? "visible" : "hidden"}
              transition={{ delay: 1 }}
            >
              
            </motion.div>
          </motion.div>

          {/* Image Section */}
          <motion.div
            className="z-10 flex justify-center items-center order-first md:order-last"
            style={{ y: imageY }}
            variants={imageContainer}
            initial="hidden"
            animate={loaded ? "visible" : "hidden"}
          >
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-br from-yellow-400 to-amber-300 rounded-3xl blur-md opacity-75" />

              {/* Main image */}
              <motion.div
                className="relative rounded-3xl overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <img
                  src={SideImage}
                  alt="Xopy App Interface"
                  className="w-full max-w-md md:max-w-lg rounded-3xl shadow-lg"
                />

                {/* Floating card */}
                <motion.div
                  className="absolute -bottom-6 -right-6 md:-bottom-8 md:-right-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={loaded ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 1.2, duration: 0.8 }}
                >
                  <Card className="shadow-lg w-44 md:w-56 bg-white/90 backdrop-blur border-0">
                  </Card>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
