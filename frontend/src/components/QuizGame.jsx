import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from 'react-router-dom';
import { Trophy, Share2, Loader2 } from 'lucide-react';

const QuizGame = ({ studySetId, shareableId }) => {
  const [gameSession, setGameSession] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const { user } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    // Log the props to verify what we're receiving
    console.log('QuizGame props:', { studySetId, shareableId });
    
    if (!studySetId && !shareableId) {
      setError('No study set ID or shareable ID provided');
      setLoading(false);
      return;
    }

    startNewGame();
  }, [studySetId, shareableId]);

  const startNewGame = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user?.sub) {
        throw new Error('User must be logged in to start a quiz');
      }

      const payload = {
        user: { sub: user.sub }
      };

      // Add either studySetId or shareableId to the payload
      if (studySetId) {
        payload.studySetId = studySetId;
      } else if (shareableId) {
        payload.shareableId = shareableId;
      }

      console.log('Starting quiz with payload:', payload); // Debug log
      
      const response = await fetch('http://localhost:3000/start-quiz-mode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      console.log('Quiz start response:', data); // Debug log

      if (!response.ok) {
        throw new Error(data.error || 'Failed to start quiz');
      }

      if (!data.questions || data.questions.length === 0) {
        throw new Error('No questions available for this study set');
      }

      setGameSession(data.gameSession);
      setQuestions(data.questions);
      setShareUrl(`${window.location.origin}/quiz/share/${data.shareableId}`);
    } catch (error) {
      console.error('Error starting quiz:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmit = async (selectedAnswer) => {
    try {
      if (!gameSession) {
        throw new Error('No active game session');
      }

      const currentQuestion = questions[currentQuestionIndex];
      if (!currentQuestion) {
        throw new Error('Invalid question index');
      }

      console.log('Submitting answer:', { 
        gameSessionId: gameSession,
        questionId: currentQuestion.id,
        answer: selectedAnswer 
      }); // Debug log

      const response = await fetch('http://localhost:3000/submit-quiz-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameSessionId: gameSession,
          questionId: currentQuestion.id,
          answer: selectedAnswer
        }),
      });

      const data = await response.json();
      console.log('Answer submission response:', data); // Debug log

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit answer');
      }

      if (currentQuestionIndex + 1 >= questions.length) {
        setGameCompleted(true);
      } else {
        setCurrentQuestionIndex(prev => prev + 1);
      }

      return data;
    } catch (error) {
      console.error('Error submitting answer:', error);
      setError(error.message);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert('Quiz link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
      setError('Failed to copy link to clipboard');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl mx-auto">
        <div className="text-red-500 mb-4">Error: {error}</div>
        <button 
          onClick={startNewGame}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl mx-auto">
        <div className="text-gray-500 mb-4">No questions available for this study set</div>
        <button 
          onClick={startNewGame}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (gameCompleted) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl mx-auto">
        <div className="mb-4">
          <div className="flex items-center gap-2 text-xl font-bold">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Quiz Completed!
          </div>
        </div>
        <div className="py-4">
          <p className="text-lg mb-4">
            Your final score: {questions.length} out of {questions.length}
          </p>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            <Share2 className="h-4 w-4" />
            Share Quiz
          </button>
        </div>
        <div className="pt-4 border-t">
          <button 
            onClick={startNewGame}
            className="px-4 py-2 border rounded hover:bg-gray-50"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl mx-auto">
      <div className="mb-4">
        <h2 className="text-xl font-bold">
          Question {currentQuestionIndex + 1} of {questions.length}
        </h2>
      </div>
      <div className="space-y-6">
        <p className="text-lg font-medium">{currentQuestion.question}</p>
        <div className="grid gap-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              className="w-full text-left px-4 py-2 border rounded hover:bg-gray-50"
              onClick={() => handleAnswerSubmit(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizGame;