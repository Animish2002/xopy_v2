import React from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

const Mission = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1, // Trigger when 40% of the element is visible
  });

  React.useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const underlineVariants = {
    hidden: { width: 0 },
    visible: { width: "23%", transition: { duration: 0.8 } },
  };

  return (
    <div className="md:mt-10">
      <div className="flex justify-center items-center mt-16 px-2 mission h-80 relative ui">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={containerVariants}
        >
          <motion.h2
            className="md:text-3xl text-lg mb-4"
            variants={textVariants}
          >
            Our Mission
          </motion.h2>
          <motion.p
            className="md:text-4xl text-[1.25rem] font-bold leading-relaxed"
            variants={textVariants}
          >
            Facilitate a convenient and secure
            <br />
            platform which will cut down your
            <br />
            <motion.span
              className="curved-underline1"
              variants={underlineVariants}
              style={{ display: "inline-block", overflow: "hidden" }}
            >
              worries.
            </motion.span>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default Mission;
