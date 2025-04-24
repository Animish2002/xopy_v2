import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

// Import shadcn components
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";

// Icons using Lucide React instead of images
import {
  Cloud,
  Share2,
  HardDrive,
  Smartphone,
  BarChart4,
  ShieldCheck,
} from "lucide-react";

const XopyFeatures = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const features = [
    {
      icon: (
        <ShieldCheck size={24} className="text-blue-600 dark:text-blue-400" />
      ),
      title: "Secure Uploads",
      description:
        "All files are encrypted during upload and transfer to protect your data.",
      category: "security",
      highlight: true,
    },
    {
      icon: (
        <Share2 size={24} className="text-indigo-500 dark:text-indigo-400" />
      ),
      title: "Instant Sharing",
      description:
        "Share files instantly with a simple link, no account required.",
      category: "sharing",
    },
    {
      icon: (
        <HardDrive
          size={24}
          className="text-emerald-500 dark:text-emerald-400"
        />
      ),
      title: "Unlimited Uploads",
      description:
        "Store and share as many files as you need, with no storage limits.",
      category: "storage",
    },
    {
      icon: (
        <Smartphone size={24} className="text-amber-500 dark:text-amber-400" />
      ),
      title: "Mobile Access",
      description:
        "Access your files from anywhere, on any device, with our mobile-friendly interface.",
      category: "access",
    },
    {
      icon: (
        <BarChart4 size={24} className="text-purple-500 dark:text-purple-400" />
      ),
      title: "Advanced Analytics",
      description:
        "Track file activity and usage with detailed analytics and reporting.",
      category: "analytics",
    },
    {
      icon: <Cloud size={24} className="text-teal-500 dark:text-teal-400" />,
      title: "Seamless File Sharing",
      description:
        "Seamless file sharing without any hassle, simple and secure.",
      category: "sharing",
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const cardVariants = {
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

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative py-24 bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl"></div>

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>

      <motion.div
        className="container mx-auto px-4 relative z-10"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        {/* Section Header */}
        <motion.div
          className="max-w-3xl mx-auto text-center mb-16"
          variants={headerVariants}
        >
          <Badge
            variant="outline"
            className="px-4 py-1.5 mb-6 text-sm font-medium border-blue-200 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full shadow-sm"
          >
            Features
          </Badge>
          <h2 className="ui text-4xl md:text-5xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-yellow-700 dark:from-yellow-500 dark:to-yellow-600">
            Why Choose Xopy?
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Xopy offers unique features to make file sharing easy, secure, and
            efficient. Built for both individuals and teams.
          </p>
        </motion.div>

        {/* Tabs (Mobile-Optimized View) */}
        <div className="md:hidden mb-12">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid grid-cols-3 w-full mb-8 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm p-1 rounded-xl">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="sharing">Sharing</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <FeatureGrid
                features={features}
                cardVariants={cardVariants}
                containerVariants={containerVariants}
              />
            </TabsContent>
            <TabsContent value="security">
              <FeatureGrid
                features={features.filter((f) => f.category === "security")}
                cardVariants={cardVariants}
              />
            </TabsContent>
            <TabsContent value="sharing">
              <FeatureGrid
                features={features.filter((f) => f.category === "sharing")}
                cardVariants={cardVariants}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Desktop Grid View */}
        <div className="hidden md:block">
          <FeatureGrid features={features} cardVariants={cardVariants} />
        </div>
      </motion.div>
    </section>
  );
};

// Separated Feature Grid component
const FeatureGrid = ({ features, cardVariants, containerVariants }) => (
  <motion.div
    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 md:max-w-10/12 mx-auto"
    variants={containerVariants}
  >
    {features.map((feature, index) => (
      <Feature
        key={index}
        feature={feature}
        index={index}
        variants={cardVariants}
      />
    ))}
  </motion.div>
);

// Enhanced Feature component
const Feature = ({ feature, index, variants }) => {
  const { icon, title, description, highlight } = feature;

  // Animation for icon
  const iconVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        delay: index * 0.05 + 0.2,
      },
    },
    hover: {
      scale: 1.1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
  };

  return (
    <motion.div
      variants={variants}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Card
        className={`h-full overflow-hidden border-0 ${
          highlight
            ? "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-indigo-900/20"
            : "bg-white/90 dark:bg-slate-800/90"
        } backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl`}
      >
        <CardContent className="px-6 flex flex-col h-full">
          {/* Icon with animation */}
          <motion.div
            className={`mb-6 p-4 rounded-xl ${
              highlight
                ? "bg-blue-100/80 dark:bg-blue-900/30"
                : "bg-slate-100 dark:bg-slate-700/50"
            } w-16 h-16 flex items-center justify-center`}
            variants={iconVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
          >
            {icon}
          </motion.div>

          {/* Content */}
          <div>
            <div className="flex items-center mb-3">
              <h3 className="text-xl font-bold">{title}</h3>
              {highlight && (
                <Badge className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  Popular
                </Badge>
              )}
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Learn More Link (Optional) */}
          {highlight && (
            <div className="mt-auto pt-4">
              <motion.a
                href="#"
                className="text-blue-600 dark:text-blue-400 font-medium inline-flex items-center group"
                whileHover={{ x: 4 }}
              >
                Learn more
                <svg
                  className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </motion.a>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Add CSS for background grid pattern
const style = document.createElement("style");
style.textContent = `
  .bg-grid-pattern {
    background-image: linear-gradient(to right, rgba(200, 200, 200, 0.1) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(200, 200, 200, 0.1) 1px, transparent 1px);
    background-size: 24px 24px;
  }
  
  @media (prefers-color-scheme: dark) {
    .bg-grid-pattern {
      background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
    }
  }
`;
document.head.appendChild(style);

export default XopyFeatures;
