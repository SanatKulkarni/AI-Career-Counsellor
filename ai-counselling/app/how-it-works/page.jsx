"use client";
import { motion } from 'framer-motion';
import { FaFileUpload, FaRobot, FaMicrophone, FaChartLine } from 'react-icons/fa';

export default function HowItWorks() {
  const steps = [
    {
      icon: <FaFileUpload className="w-16 h-16 text-indigo-500" />,
      title: "Upload Your Resume",
      description: "Start by uploading your resume. Our AI system will analyze your experience, skills, and qualifications."
    },
    {
      icon: <FaRobot className="w-16 h-16 text-indigo-500" />,
      title: "AI Analysis",
      description: "Our advanced AI processes your resume to identify key strengths, potential career paths, and areas for improvement."
    },
    {
      icon: <FaMicrophone className="w-16 h-16 text-indigo-500" />,
      title: "Practice Interview",
      description: "Engage in a realistic interview simulation with AI-generated questions tailored to your profile."
    },
    {
      icon: <FaChartLine className="w-16 h-16 text-indigo-500" />,
      title: "Get Detailed Feedback",
      description: "Receive comprehensive feedback on your interview performance and personalized career recommendations."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            How It <span className="text-indigo-600">Works</span>
          </h1>
          <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
            Our AI-powered platform simplifies your career development journey in four easy steps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-8 transform hover:scale-105 transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-indigo-50 rounded-full p-6 mb-6">
                  {step.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 text-center"
        >
          <div className="bg-indigo-600 rounded-xl shadow-2xl p-12">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-indigo-100 text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who have transformed their careers with our AI-powered guidance.
            </p>
            <a
              href="/interview"
              className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 transition-colors duration-300"
            >
              Start Now
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}