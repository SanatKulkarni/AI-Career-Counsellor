"use client";
import { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { motion } from 'framer-motion';
import * as pdfjs from 'pdfjs-dist';

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function ResumeAnalysis() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  const convertPdfToImage = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    const page = await pdf.getPage(1);
    
    const viewport = page.getViewport({ scale: 2.0 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({
      canvasContext: context,
      viewport: viewport
    }).promise;

    return canvas.toDataURL('image/png').split(',')[1];
  };

  const analyzeResume = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const imageBase64 = await convertPdfToImage(file);
      
      const genAI = new GoogleGenerativeAI('AIzaSyAzJno6phNweWn4MMU4j6LUgcqDfTW_cDk');
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const imagePart = {
        inlineData: {
          data: imageBase64,
          mimeType: 'image/png'
        }
      };

      const prompt = "Analyze this resume and provide: 1. ATS Score (out of 100) 2. Detailed resume feedback (strengths and areas for improvement) 3. Career path recommendations based on skills and experience";

      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      setAnalysis(response.text());
    } catch (err) {
      setError('Error analyzing resume. Please try again.');
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Resume Analysis
          </h1>

          <form onSubmit={analyzeResume} className="space-y-6">
            <div className="flex flex-col items-center justify-center w-full">
              <label
                className="w-full flex flex-col items-center px-4 py-6 bg-indigo-50 text-indigo-700 rounded-lg shadow-lg tracking-wide border border-indigo-200 cursor-pointer hover:bg-indigo-100 transition duration-300"
              >
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1z" />
                </svg>
                <span className="mt-2 text-base leading-normal">
                  {file ? file.name : 'Select your resume (PDF)'}
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </label>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={!file || loading}
                className={`px-6 py-3 rounded-md text-white font-medium ${
                  !file || loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                } transition duration-300`}
              >
                {loading ? 'Analyzing...' : 'Analyze Resume'}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-50 rounded-md text-red-700">
              {error}
            </div>
          )}

          {analysis && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mt-8 space-y-6"
            >
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Analysis Results</h2>
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700">
                    {analysis}
                  </pre>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}