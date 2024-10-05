import React, { useState, useEffect } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import { FaCheckCircle, FaShieldAlt, FaClock, FaSync } from 'react-icons/fa';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ParallaxProvider, Parallax } from 'react-scroll-parallax';

function FeatureCard({ icon, title, description }) {
  const controls = useAnimation();
  const [ref, inView] = useInView();
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 50 },
      }}
      transition={{ duration: 0.5 }}
      className="flex-1 sm:w-[350px] sm:min-w-[350px] w-full rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer relative"
      onClick={() => setIsFlipped(!isFlipped)}
      style={{ height: '400px', perspective: '1000px' }}
    >
      <motion.div
        className="w-full h-full relative"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div
          className={`bg-[#F38120] w-full h-full absolute backface-hidden flex flex-col items-center justify-center p-6 ${
            isFlipped ? 'hidden' : 'block'
          }`}
          style={{
            borderRadius: '0.5rem',
          }}
        >
          <div className="w-20 h-20 flex justify-center items-center bg-[#F38120] rounded-full mb-6">
            {React.cloneElement(icon, { className: 'text-white w-10 h-10' })}
          </div>
          <h3 className="text-2xl font-bold text-white text-center">{title}</h3>
          <div className="absolute bottom-4 right-4">
            <FaSync className="text-white w-6 h-6 animate-pulse" />
          </div>
        </div>
        <div
          className={`bg-[#F38120] w-full h-full absolute backface-hidden flex items-center justify-center p-6 ${
            isFlipped ? 'block' : 'hidden'
          }`}
          style={{
            transform: 'rotateY(180deg)',
            borderRadius: '0.5rem',
          }}
        >
          <p className="text-lg text-white text-center">{description}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function LandingPage() {
  const [navOpen, setNavOpen] = useState(false);

  const toggleNav = () => {
    setNavOpen(!navOpen);
  };

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <ParallaxProvider>
      <div className="landing-page">
        {/* Navbar */}
        <header className="navbar fixed top-0 left-0 w-full bg-[#686D76] text-white p-4 flex justify-between items-center z-50">
          <div className="navbar-logo text-sm font-serif flex items-center">
            <img src="/SC.png" alt="Logo" className="h-12 w-12 mr-2" />
          </div>
          <nav className="hidden lg:flex flex-1 justify-center">
            <ul className="flex gap-12">
              <li>
                <button onClick={() => scrollToSection('hero')} className="hover:text-gray-300">
                  Platform
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('features')} className="hover:text-gray-300">
                  About us
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('join-us')} className="hover:text-gray-300">
                  Contact
                </button>
              </li>
            </ul>
          </nav>
          <div className="hidden lg:flex gap-4">
            <button
              className="bg-white text-[#F38120] py-2 px-4 rounded hover:bg-[#F38120] transition-all hover:text-black"
              onClick={() => window.location.href = '/signin'}
            >
              Sign In
            </button>
            <button
              className="bg-white text-[#F38120] py-2 px-4 rounded hover:bg-[#F38120] transition-all hover:text-black"
              onClick={() => window.location.href = '/signup'}
            >
              Sign Up
            </button>
          </div>
          <div className="lg:hidden">
            <AiOutlineMenu className="text-white text-2xl cursor-pointer" onClick={toggleNav} />
          </div>
        </header>

        {/* Mobile Navbar */}
        {navOpen && (
          <div className="bg-[#DC5F00] text-white p-4 lg:hidden">
            <ul className="flex flex-col gap-4">
              <li>
                <button onClick={() => scrollToSection('hero')} className="hover:text-gray-300">
                  Platform
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('features')} className="hover:text-gray-300">
                  About us
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('join-us')} className="hover:text-gray-300">
                  Contact
                </button>
              </li>
              <li>
                <button
                  className="bg-white text-[#F38120] py-2 px-4 rounded hover:bg-gray-200 transition-all border-2 border-white hover:text-black"
                  onClick={() => window.location.href = '/signin'}
                >
                  Sign In
                </button>
              </li>
              <li>
                <button
                  className="bg-white text-[#F38120] py-2 px-4 rounded hover:bg-gray-200 transition-all border-2 border-white hover:text-black"
                  onClick={() => window.location.href = '/signup'}
                >
                  Sign Up
                </button>
              </li>
            </ul>
          </div>
        )}

        {/* Hero Section */}
        <section id="hero" className="relative w-full min-h-screen bg-gray-100 overflow-hidden pt-20">
          <Parallax y={[-20, 20]} tagOuter="figure">
            <div className="absolute inset-0 z-0">
              <img src="/background-pattern.svg" alt="Background Pattern" className="w-full h-full object-cover opacity-10" />
            </div>
          </Parallax>
          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-10 max-container px-6 lg:px-20 py-20">
            <motion.div
              className="lg:w-1/2 flex flex-col justify-center items-start"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-xl font-serif text-[#F38120]">Secure Chain Vehicle Registration</p>
              <h1 className="mt-6 font-bold text-4xl lg:text-6xl max-sm:text-[48px] max-sm:leading-[56px]">
                <span className="relative z-10 pr-10 text-[#373A40]">A New Era of Vehicle Registration</span>
                <br />
                <span className="text-[#F38120] inline-block mt-3">Explore the System</span>
              </h1>
            </motion.div>

            <motion.div
              className="lg:w-1/2 flex flex-col justify-center items-center"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.img
                src="/herocar.png"
                alt="Hero Car"
                className="object-contain relative z-10 w-full max-w-[600px] h-auto"
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 5, 0, -5, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-gray-100 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12 text-[#F38120]">Our Key Features</h2>
            <div className="flex justify-center flex-wrap gap-8">
              <FeatureCard
                icon={<FaCheckCircle />}
                title="Enhanced Trust"
                description="With transparent and secure data management, gain the trust of all stakeholders. Our blockchain-based system ensures immutability and traceability of all vehicle registration records."
              />
              <FeatureCard
                icon={<FaShieldAlt />}
                title="Reduced Fraud"
                description="Blockchain technology significantly reduces the risk of fraud and data manipulation. Every transaction is cryptographically secured and verified by multiple nodes in the network."
              />
              <FeatureCard
                icon={<FaClock />}
                title="Improved Efficiency"
                description="Automated processes and decentralized validation lead to faster and more reliable registration services. Say goodbye to long queues and paperwork - experience the future of vehicle registration."
              />
            </div>
          </div>
        </section>

        {/* Join Us Section */}
        <section id="join-us" className="bg-gray-100 py-16">
          <div className="max-w-7xl mx-auto px-4 flex items-stretch gap-12">
            <div className="flex-1 flex flex-col justify-between">
              <div className="flex flex-col justify-center h-full">
                <h2 className="text-5xl font-bold text-[#F38120] leading-tight mb-4">
                  Let's Work Together
                </h2>
                <p className="text-gray-600 text-lg leading-loose max-w-md mb-6">
                  Join us in transforming vehicle registration.
                  <br />
                  Sign up today and experience the benefits of a secure and efficient system!
                </p>
                {/* Sign Up Button */}
                <button
                  onClick={() => window.location.href = '/signup'}
                  className="bg-[#F38120] text-white py-3 px-6 rounded hover:bg-[#e0701c] transition-all w-fit"
                >
                  Join Now!
                </button>
              </div>
            </div>
            <div className="flex-1 flex justify-center items-center">
              <img src="/handshake.png" alt="Handshake" className="object-contain w-full max-w-sm" />
            </div>
          </div>
        </section>

        {/* Footer Section */}
        <footer className="footer bg-[#F38120] text-white p-4 text-center">
          <p>© 2024 Secure Chain. All rights reserved.</p>
        </footer>
      </div>
    </ParallaxProvider>
  );
}
