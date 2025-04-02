"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function NewbieQuestionnaire() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const questions = [
    {
      id: 1,
      question: "How do you prefer to spend your free time?",
      options: [
        "Reading and learning new things",
        "Being creative and artistic",
        "Helping and interacting with others",
        "Solving problems and puzzles",
        "Leading and organizing activities"
      ]
    },
    {
      id: 2,
      question: "In a group project, what role do you naturally take?",
      options: [
        "The researcher who gathers information",
        "The creative who brings new ideas",
        "The mediator who keeps everyone happy",
        "The analyst who solves problems",
        "The leader who coordinates everything"
      ]
    },
    {
      id: 3,
      question: "What type of work environment appeals to you most?",
      options: [
        "Quiet and structured",
        "Creative and flexible",
        "Collaborative and social",
        "Technical and challenging",
        "Dynamic and fast-paced"
      ]
    },
    {
      id: 4,
      question: "What motivates you the most?",
      options: [
        "Learning and personal growth",
        "Self-expression and creativity",
        "Making a difference in others' lives",
        "Achievement and problem-solving",
        "Recognition and leadership"
      ]
    },
    {
      id: 5,
      question: "How do you handle challenges?",
      options: [
        "Research and analyze thoroughly",
        "Think outside the box",
        "Seek advice from others",
        "Break it down systematically",
        "Take charge and delegate"
      ]
    },
    {
      id: 6,
      question: "What kind of tasks energize you the most?",
      options: [
        "Analyzing data and finding patterns",
        "Creating something new and unique",
        "Teaching and mentoring others",
        "Building and fixing things",
        "Planning and organizing events"
      ]
    },
    {
      id: 7,
      question: "How do you prefer to communicate with others?",
      options: [
        "Through detailed written explanations",
        "Using visual aids and demonstrations",
        "Face-to-face conversations",
        "Direct and straightforward discussion",
        "Group presentations and meetings"
      ]
    },
    {
      id: 8,
      question: "What type of recognition matters most to you?",
      options: [
        "Academic or intellectual achievements",
        "Innovation and creativity awards",
        "Positive feedback from people you've helped",
        "Technical accomplishments",
        "Leadership and management success"
      ]
    },
    {
      id: 9,
      question: "How do you approach learning new skills?",
      options: [
        "Reading and researching thoroughly",
        "Experimenting and learning by doing",
        "Learning from others' experiences",
        "Following structured tutorials",
        "Taking charge of your learning path"
      ]
    },
    {
      id: 10,
      question: "What's your ideal way of solving problems?",
      options: [
        "Gathering and analyzing information",
        "Finding innovative solutions",
        "Collaborating with others",
        "Using logical step-by-step approaches",
        "Making quick, decisive actions"
      ]
    },
    {
      id: 11,
      question: "What aspect of a job is most important to you?",
      options: [
        "Intellectual stimulation",
        "Creative freedom",
        "Making a positive impact",
        "Technical challenges",
        "Growth and advancement opportunities"
      ]
    },
    {
      id: 12,
      question: "How do you handle deadlines and pressure?",
      options: [
        "Create detailed plans and schedules",
        "Find unique ways to complete tasks faster",
        "Seek support from team members",
        "Break down tasks into manageable parts",
        "Take control and delegate effectively"
      ]
    },
    {
      id: 13,
      question: "What type of feedback do you prefer?",
      options: [
        "Detailed and analytical",
        "Open-ended and imaginative",
        "Supportive and encouraging",
        "Clear and specific",
        "Results-oriented"
      ]
    },
    {
      id: 14,
      question: "How do you prefer to make decisions?",
      options: [
        "Through thorough research and analysis",
        "Based on intuition and creativity",
        "Considering impact on others",
        "Using logical reasoning",
        "Quick and decisive action"
      ]
    },
    {
      id: 15,
      question: "What kind of impact do you want to have in your career?",
      options: [
        "Advancing knowledge and understanding",
        "Inspiring innovation and creativity",
        "Helping and empowering others",
        "Solving complex problems",
        "Leading positive change"
      ]
    }
  ];

  const handleAnswer = (answer) => {
    setAnswers({ ...answers, [currentQuestion]: answer });
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      analyzeAnswers();
    }
  };

  const analyzeAnswers = async () => {
    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI('');
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const prompt = `Based on these career questionnaire answers, analyze the personality type and suggest suitable careers. Provide the response in this format:
      1. Personality Analysis
      2. Top 5 Career Recommendations
      3. Skills to Develop
      
      Answers:
      ${questions.map((q, i) => `
        Question: ${q.question}
        Answer: ${q.options[answers[i]]}
      `).join('\n')}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      setResult(response.text());
    } catch (error) {
      console.error('Analysis error:', error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <h1 className="text-3xl font-bold text-black mb-8 text-center">
            Career Guidance Questionnaire
          </h1>

          {!result ? (
            <div className="space-y-6">
              <div className="mb-8">
                <div className="flex justify-between mb-4">
                  <span className="text-sm text-black">
                    Question {currentQuestion + 1} of {questions.length}
                  </span>
                  <span className="text-sm text-black">
                    {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-purple-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              <h2 className="text-xl font-semibold text-black mb-4">
                {questions[currentQuestion].question}
              </h2>

              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(index)}
                    className="w-full p-4 text-left text-black rounded-lg border border-purple-200 hover:border-purple-500 hover:bg-purple-50 transition-all duration-200"
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="prose max-w-none"
            >
              <div className="text-black font-medium leading-relaxed">
                <pre className="whitespace-pre-wrap text-base text-black">
                  {result}
                </pre>
              </div>
            </motion.div>
          )}

          {loading && (
            <div className="text-center mt-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent"></div>
              <p className="mt-2 text-black">Analyzing your responses...</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
