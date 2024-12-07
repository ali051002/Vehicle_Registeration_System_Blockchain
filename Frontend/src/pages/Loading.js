import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

const LoadingPage = () => {
  const [progress, setProgress] = useState(0);
  const controls = useAnimation();

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prevProgress + 1;
      });
    }, 50);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    controls.start({
      strokeDashoffset: 100 - progress,
      transition: { duration: 1, ease: "easeInOut" }
    });
  }, [progress, controls]);

  // Dynamically slow down animations as progress increases
  const animationDuration = progress < 100 ? Math.max(15, 30 - (progress / 100) * 10) : 30;
  const subtleDuration = 40; // After reaching 100%, even slower and more subtle animations

  const circleVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 2,
        ease: "easeInOut",
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 1, ease: "easeOut" }
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black text-white overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 z-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-[#F38120] rounded-full opacity-10"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.03, 1],  // More subtle scaling
              opacity: [0.05, 0.08, 0.05],  // More subtle opacity change
            }}
            transition={{
              duration: progress < 100 ? animationDuration : subtleDuration,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center space-y-8"
        variants={circleVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo placeholder */}
        <motion.div
          className="w-32 h-32 rounded-full flex items-center justify-center"
          variants={itemVariants}
        >
          <img src="/SC.png" alt="Logo" className="w-full h-full object-contain" />
        </motion.div>

        {/* Loading text */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl font-extrabold text-[#F38120]"
        >
          Loading...
        </motion.h1>

        {/* Circular progress */}
        <motion.div className="relative w-48 h-48">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#4A4D52"
              strokeWidth="8"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#F38120"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="283"
              animate={controls}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold">{`${progress}%`}</span>
          </div>
        </motion.div>

        {/* Loading message */}
        <motion.p
          variants={itemVariants}
          className="text-lg font-light text-gray-300"
        >
          Initializing secure blockchain...
        </motion.p>
      </motion.div>

      {/* Animated particles */}
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-white rounded-full w-1 h-1"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -5, 0],  // More subtle movement
            opacity: [0, 0.5, 0],  // Less intense opacity change
          }}
          transition={{
            duration: progress < 100 ? animationDuration : subtleDuration,
            repeat: Infinity,
            repeatType: "loop",
            delay: Math.random() * 5,  // Increased delay for more staggered effect
          }}
        />
      ))}

      {/* Footer */}
      <motion.div
        className="absolute bottom-4 text-sm text-gray-400 font-light"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 1 }}  // Slowed down
      >
        © 2024 SecureChain. All Rights Reserved.
      </motion.div>
    </div>
  );
};

export default LoadingPage;
