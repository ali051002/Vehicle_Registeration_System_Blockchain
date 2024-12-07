import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCarAlt, FaUser, FaClock, FaExchangeAlt } from 'react-icons/fa';
import SideNavBar from '../components/SideNavBar';
import TopNavBar from '../components/TopNavBar';
const TransactionCard = ({ transaction }) => {
  return (
    <motion.div
      className="bg-white rounded-lg shadow-lg overflow-hidden h-full"
      whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(243, 129, 32, 0.3)' }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="p-6 flex flex-col h-full">
        <h3 className="text-xl font-bold text-[#4A4D52] mb-4">{transaction.transactionType}</h3>
        <div className="grid grid-cols-2 gap-4 flex-grow">
          <div>
            <h4 className="font-semibold text-[#F38120] mb-1">From</h4>
            <div className="flex items-center">
              <FaUser className="text-[#F38120] mr-2" />
              <span className="text-gray-600">{transaction.FromUserName}</span>
            </div>
          </div>
          {transaction.ToUserName && (
            <div>
              <h4 className="font-semibold text-[#F38120] mb-1">To</h4>
              <div className="flex items-center">
                <FaUser className="text-[#F38120] mr-2" />
                <span className="text-gray-600">{transaction.ToUserName}</span>
              </div>
            </div>
          )}
          <div>
            <h4 className="font-semibold text-[#F38120] mb-1">Vehicle</h4>
            <div className="flex items-center">
              <FaCarAlt className="text-[#F38120] mr-2" />
              <span className="text-gray-600">{`${transaction.make} ${transaction.model} (${transaction.year})`}</span>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-[#F38120] mb-1">Timestamp</h4>
            <div className="flex items-center">
              <FaClock className="text-[#F38120] mr-2" />
              <span className="text-gray-600">{new Date(transaction.timestamp).toLocaleString()}</span>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-[#F38120] mb-1">Status</h4>
            <div className="flex items-center">
              <FaExchangeAlt className="text-[#F38120] mr-2" />
              <span className={`text-gray-600 ${transaction.transactionStatus === 'Approved' ? 'text-green-500' : transaction.transactionStatus === 'Rejected' ? 'text-red-500' : 'text-yellow-500'}`}>
                {transaction.transactionStatus}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false); // State for Sidebar toggle

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get('http://localhost:8085/api/transactions');
        setTransactions(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Top Navigation Bar */}
      <TopNavBar toggleNav={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 overflow-hidden">
        {/* Side Navigation Bar */}
        <SideNavBar
          navOpen={sidebarOpen}
          toggleNav={() => setSidebarOpen(!sidebarOpen)}
          userRole="governmentOfficial"
        />

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 lg:p-10">
          <div className="container mx-auto px-6 py-8">
            <h1 className="text-4xl font-bold text-[#F38120] text-center mb-10">Transactions</h1>

            {loading ? (
              <div className="text-center text-lg text-gray-600">Loading transactions...</div>
            ) : (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, staggerChildren: 0.1 }}
              >
                <AnimatePresence>
                  {transactions
                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) // Sort by timestamp (most recent first)
                    .map((transaction) => (
                      <motion.div
                        key={transaction.TransactionId}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.5 }}
                      >
                        <TransactionCard transaction={transaction} />
                      </motion.div>
                    ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Transactions;
