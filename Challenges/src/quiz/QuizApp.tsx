import React, { useState, useEffect } from 'react';
import './QuizApp.css';

interface Question {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

const decodeHTML = (html: string) => {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};

const QuizApp: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://opentdb.com/api.php?amount=10&type=multiple');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const decodedQuestions = data.results.map((q: Question) => ({
          ...q,
          question: decodeHTML(q.question),
          correct_answer: decodeHTML(q.correct_answer),
          incorrect_answers: q.incorrect_answers.map(decodeHTML)
        }));
        setQuestions(decodedQuestions);
      } else {
        throw new Error('No questions received from the API');
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      setError('Failed to load questions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerClick = (selectedAnswer: string) => {
    if (questions[currentQuestion] && selectedAnswer === questions[currentQuestion].correct_answer) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    fetchQuestions();
  };

  if (loading) {
    return <div className="loading-quiz">Loading questions...</div>;
  }

  if (error) {
    return (
      <div className="error-quiz">
        <p>{error}</p>
        <button className="restart-button" onClick={restartQuiz}>Try Again</button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="error-quiz">
        <p>No questions available. Please try again.</p>
        <button className="restart-button" onClick={restartQuiz}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="quiz-container">
        {showScore ? (
          <div className="score-section">
            <h2>Quiz Completed!</h2>
            <p>You scored {score} out of {questions.length}</p>
            <button className="restart-button" onClick={restartQuiz}>Restart Quiz</button>
          </div>
        ) : (
          <>
            <div className="question-section">
              <div className="question-count">
                <span>Question {currentQuestion + 1}</span>/{questions.length}
              </div>
              <div className="question-text">{questions[currentQuestion].question}</div>
            </div>
            <div className="answer-section">
              {[...questions[currentQuestion].incorrect_answers, questions[currentQuestion].correct_answer]
                .sort(() => Math.random() - 0.5)
                .map((answer, index) => (
                  <button
                    className="answer-button"
                    key={index}
                    onClick={() => handleAnswerClick(answer)}
                  >
                    {answer}
                  </button>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QuizApp;