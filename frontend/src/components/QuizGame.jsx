import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from 'react-router-dom';
import { Trophy, Loader2, Share2, ArrowLeft } from 'lucide-react';

const QuizGame = ({ studySetId, shareableId }) => {
  const [gameSession, setGameSession] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [quizShareableId, setQuizShareableId] = useState(null);
  const { user } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (shareableId) {
      loadSharedQuiz();
    } else if (studySetId) {
      startNewGame();
    } else {
      setError('No study set ID or shareable ID provided');
      setLoading(false);
    }
  }, [studySetId, shareableId]);

  const loadSharedQuiz = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/load-shared-quiz/${shareableId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load shared quiz');
      }

      setGameSession(data.gameSession);
      setQuestions(data.questions);
      setQuizShareableId(shareableId);
    } catch (error) {
      console.error('Error loading shared quiz:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const startNewGame = async () => {
    try {
      setLoading(true);
      setError(null);
      setGameCompleted(false);
      setCurrentQuestionIndex(0);
      setQuestions([]);
      setCorrectAnswers(0);
      
      if (!user?.sub) {
        throw new Error('User must be logged in to start a quiz');
      }
  
      const response = await fetch('http://localhost:3000/start-quiz-mode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: { sub: user.sub },
          studySetId: studySetId
        })
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || 'Failed to start quiz');
      }
  
      setGameSession(data.gameSession);
      setQuestions(data.questions);
      setQuizShareableId(data.shareableId);
    } catch (error) {
      console.error('Error starting quiz:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShareQuiz = () => {
    const shareUrl = `${window.location.origin}/quiz/share/${quizShareableId}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Quiz link copied to clipboard!');
  };

  const handleFinishQuiz = () => {
    navigate(-1);
  };

  const handleAnswerSubmit = async (selectedAnswer) => {
    try {
      const currentQuestion = questions[currentQuestionIndex];
      if (!currentQuestion) {
        throw new Error('Invalid question index');
      }

      if (shareableId) {
        const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
        if (isCorrect) {
          setCorrectAnswers(prev => prev + 1);
        }
        
        if (currentQuestionIndex + 1 >= questions.length) {
          setGameCompleted(true);
        } else {
          setCurrentQuestionIndex(prev => prev + 1);
        }
        return;
      }
  
      if (!gameSession) {
        throw new Error('No active game session');
      }
  
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
  
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit answer');
      }
  
      if (selectedAnswer === currentQuestion.correctAnswer) {
        setCorrectAnswers(prev => prev + 1);
      }

      // Remove focus from all option buttons
      document.querySelectorAll('.option-button').forEach(button => {
        button.blur();
      });

      // Check if quiz is complete and update question index

      if (currentQuestionIndex + 1 >= questions.length) {
        setGameCompleted(true);
      } else {
        setCurrentQuestionIndex(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl mx-auto">
        <div className="text-red-500 mb-6 text-center font-medium">{error}</div>
        <button 
          onClick={startNewGame}
          className="w-full px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (gameCompleted) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-center gap-3 text-2xl font-bold text-pink-500">
            <Trophy className="h-8 w-8" />
            Quiz Completed!
          </div>
        </div>
        <div className="text-center">
          <p className="text-xl mb-8 text-gray-700">
            Your final score: {correctAnswers} out of {questions.length}
          </p>
          {!shareableId && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button 
                onClick={startNewGame}
                style={{ width: '100%', marginBottom: '1rem' }}
                className="px-8 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors font-medium"
              >
                Play Again
              </button>
              {quizShareableId && (
                <button 
                  onClick={handleShareQuiz}
                  style={{ width: '100%', marginBottom: '1rem' }}
                  className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Share2 className="h-5 w-5" />
                  Share Quiz
                </button>
              )}
              <button 
                onClick={handleFinishQuiz}
                style={{ width: '100%' }}
                className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <ArrowLeft className="h-5 w-5" />
                Finish Quiz
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="quiz-container">
      <div className="flex justify-between items-center mb-6">
        <h2 className="question-text">
          Question {currentQuestionIndex + 1} of {questions.length}
        </h2>
      </div>
      <p className="question mb-8 text-center">{currentQuestion?.question}</p>
      <div className="options-container flex flex-col gap-4 items-center justify-center">
        {currentQuestion?.options.map((option, index) => (
          <button
            key={index}
            className="option-button w-full text-center px-6 py-4 border-2 border-gray-200 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition-all duration-200 text-gray-700 font-medium"
            onClick={() => handleAnswerSubmit(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizGame;