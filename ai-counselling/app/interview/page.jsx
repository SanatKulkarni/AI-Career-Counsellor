"use client";
import { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { motion } from 'framer-motion';
import * as pdfjs from 'pdfjs-dist';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function InterviewPractice() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [interviewAnalysis, setInterviewAnalysis] = useState(null);

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
      
      const genAI = new GoogleGenerativeAI('');
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const imagePart = {
        inlineData: {
          data: imageBase64,
          mimeType: 'image/png'
        }
      };

      const prompt = "Analyze this resume and provide: 1. Key skills and experiences 2. Potential interview questions based on the resume 3. Suggested areas to focus on during the interview";

      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      setAnalysis(response.text());
    } catch (err) {
      setError('Error analyzing resume. Please try again.');
      console.error(err);
    }
    setLoading(false);
  };

  const [recognition, setRecognition] = useState(null);

    const startRecording = async () => {
      try {
        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
  
        recognition.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');
  
          console.log('Speech Recognition Result:', transcript);
  
          const newAnswers = [...answers];
          newAnswers[currentQuestion] = transcript;
          setAnswers(newAnswers);
        };
  
        recognition.start();
        setRecognition(recognition);
        setIsRecording(true);
      } catch (err) {
        console.error('Error starting speech recognition:', err);
        setError('Error accessing microphone. Please check your permissions.');
      }
    };
  
    const stopRecording = () => {
      if (recognition && isRecording) {
        recognition.stop();
        setIsRecording(false);
        setRecognition(null);
      }
    };

  const generateQuestions = async (resumeAnalysis) => {
    try {
      const genAI = new GoogleGenerativeAI('');
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const prompt = `Generate exactly 5 interview questions based on this resume analysis. Return ONLY a JSON object in this exact format without any additional text:
        {
          "questions": [
            {
              "id": 1,
              "type": "technical",
              "question": "...",
              "category": "..."
            },
            {
              "id": 2,
              "type": "behavioral",
              "question": "...",
              "category": "..."
            }
          ]
        }

        Resume Analysis:
        ${resumeAnalysis}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const cleanedResponse = response.text().trim().replace(/^```json\n|\n```$/g, '');
      const questionsData = JSON.parse(cleanedResponse);
      setQuestions(questionsData.questions);
    } catch (err) {
      console.error('Question generation error:', err);
      setError('Error generating questions. Please try again.');
    }
  };

  const analyzeInterview = async () => {
    try {
      const genAI = new GoogleGenerativeAI('');
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const prompt = `Analyze these interview responses and provide:
        1. Overall Score (out of 100)
        2. Detailed feedback for each answer
        3. Communication style analysis
        4. Specific improvement tips
        5. Areas of strength
        
        Questions and Answers:
        ${questions.map((q, i) => `
          Question: ${q.question}
          Answer: ${answers[i] || 'No answer provided'}
        `).join('\n')}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      setInterviewAnalysis(response.text());
    } catch (err) {
      setError('Error analyzing interview. Please try again.');
      console.error(err);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      analyzeInterview();
    }
  };

  const startInterview = () => {
    setInterviewStarted(true);
    generateQuestions(analysis);
  };

  // Update the interview practice session UI
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          {!interviewStarted ? (
            <>
              <h1 className="text-3xl font-bold text-black mb-8 text-center">
                AI Interview Practice
              </h1>

              <form onSubmit={analyzeResume} className="space-y-6">
                <div className="flex flex-col items-center justify-center w-full">
                  <label className="w-full flex flex-col items-center px-4 py-6 bg-blue-50 text-blue-700 rounded-lg shadow-lg tracking-wide border border-blue-200 cursor-pointer hover:bg-blue-100 transition duration-300">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1z" />
                    </svg>
                    <span className="mt-2 text-base leading-normal">
                      {file ? file.name : 'Upload your resume (PDF)'}
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
                        : 'bg-blue-600 hover:bg-blue-700'
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
                  className="mt-8 space-y-6"
                >
                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-2xl font-semibold text-black mb-4">Resume Analysis</h2>
                    <div className="prose max-w-none">
                      <pre className="whitespace-pre-wrap text-base text-black">
                        {analysis}
                      </pre>
                    </div>
                    <button
                      onClick={startInterview}
                      className="mt-6 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
                    >
                      Start Interview Practice
                    </button>
                  </div>
                </motion.div>
              )}
            </>
          ) : (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-black mb-4">
                Interview Practice Session
              </h2>
              
              {questions.length > 0 && currentQuestion < questions.length && (
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className="bg-blue-600 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                      />
                    </div>
                    <p className="text-sm text-black mt-2">
                      Question {currentQuestion + 1} of {questions.length}
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <span className="inline-block px-2 py-1 text-sm font-medium rounded bg-blue-100 text-blue-800 mb-2">
                      {questions[currentQuestion].type}
                    </span>
                    <p className="text-xl font-medium text-black">
                      {questions[currentQuestion].question}
                    </p>
                  </div>
                  
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={startRecording}
                      disabled={isRecording}
                      className={`px-6 py-3 rounded-md text-white font-medium ${
                        isRecording ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'
                      } transition duration-300`}
                    >
                      {isRecording ? 'Recording...' : 'Start Recording'}
                    </button>
                    <button
                      onClick={stopRecording}
                      disabled={!isRecording}
                      className={`px-6 py-3 rounded-md text-white font-medium ${
                        !isRecording ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                      } transition duration-300`}
                    >
                      Stop Recording
                    </button>
                  </div>

                  {answers[currentQuestion] && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-black">Your Answer:</p>
                      <p className="text-black">{answers[currentQuestion]}</p>
                      <button
                        onClick={nextQuestion}
                        className="mt-4 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
                      >
                        Next Question
                      </button>
                    </div>
                  )}
                </div>
              )}

              {interviewAnalysis && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-8"
                >
                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-2xl font-semibold text-black mb-4">Interview Analysis</h2>
                    <div className="prose max-w-none">
                      <pre className="whitespace-pre-wrap text-base text-black">
                        {interviewAnalysis}
                      </pre>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
