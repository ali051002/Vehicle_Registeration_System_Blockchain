import React from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaUser, FaEnvelope, FaIdCard, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const UserProfile = ({ user, onClose }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0,
      transition: { 
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    },
    exit: { y: -20, opacity: 0 }
  };

  const iconVariants = {
    hidden: { scale: 0 },
    visible: { scale: 1, transition: { type: "spring", stiffness: 500, damping: 24 } },
    hover: { scale: 1.2, rotate: 360, transition: { duration: 0.3 } }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl overflow-hidden w-full max-w-md text-white"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.div 
          className="p-6 bg-gradient-to-r from-[#F38120] to-[#F3A620]"
          variants={itemVariants}
        >
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold">User Profile</h3>
            <motion.button
              onClick={onClose}
              className="text-white hover:text-gray-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaTimes />
            </motion.button>
          </div>
        </motion.div>
        <div className="p-6 space-y-6">
          <motion.div 
            className="flex items-center space-x-4"
            variants={itemVariants}
          >
            <motion.div
              className="w-24 h-24 rounded-full bg-gradient-to-r from-[#F38120] to-[#F3A620] flex items-center justify-center"
              variants={iconVariants}
              whileHover="hover"
            >
              <img
                src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.name}`}
                alt="User Avatar"
                className="w-20 h-20 rounded-full"
              />
            </motion.div>
            <div>
              <motion.h4 
                className="text-2xl font-semibold"
                variants={itemVariants}
              >
                {user.name}
              </motion.h4>
              <motion.p 
                className="text-gray-400"
                variants={itemVariants}
              >
                {user.email}
              </motion.p>
            </div>
          </motion.div>
          <motion.div 
            className="space-y-4"
            variants={itemVariants}
          >
            <ProfileItem icon={<FaIdCard />} label="CNIC" value={user.cnic} itemVariants={itemVariants} iconVariants={iconVariants} />
            <ProfileItem icon={<FaPhone />} label="Phone" value={user.phone} itemVariants={itemVariants} iconVariants={iconVariants} />
            <ProfileItem icon={<FaMapMarkerAlt />} label="Address" value={user.address} itemVariants={itemVariants} iconVariants={iconVariants} />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Pass itemVariants and iconVariants as props to ProfileItem
const ProfileItem = ({ icon, label, value, itemVariants, iconVariants }) => {
  return (
    <motion.div 
      className="flex items-center space-x-3"
      variants={itemVariants}
    >
      <motion.div
        className="w-10 h-10 rounded-full bg-[#F38120] bg-opacity-20 flex items-center justify-center"
        variants={iconVariants}
        whileHover="hover"
      >
        {React.cloneElement(icon, { className: 'text-[#F38120] w-5 h-5' })}
      </motion.div>
      <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-lg">{value}</p>
      </div>
    </motion.div>
  );
};

export default UserProfile;
