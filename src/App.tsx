import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, XCircle, Linkedin, Youtube, Instagram, Facebook, Save } from 'lucide-react';

// Interface definitions
interface Option {
  letter: string;
  text: string;
}

interface Question {
  id: number;
  domain: string;
  questionText: string;
  options: Option[];
  correctAnswerLetter: string;
  explanation: string;
}

interface UserAnswerRecord {
  selectedLetter: string | null;
  isCorrect: boolean | null;
  attempted: boolean;
}

// Interface for user progress to be stored in localStorage
interface UserProgress {
  currentQuestionIndex: number;
  userAttempts: UserAnswerRecord[];
  score: number;
  lastUpdated: string;
}

// Local storage key
const USER_PROGRESS_KEY = 'aws_exam_user_progress';

function App() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerLetter, setSelectedAnswerLetter] = useState<string | null>(null);
  const [userAttempts, setUserAttempts] = useState<UserAnswerRecord[]>([]);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [examFinished, setExamFinished] = useState(false);
  const [progressSaved, setProgressSaved] = useState(false);
  const [progressRestored, setProgressRestored] = useState(false);

  // Load questions and attempt to restore progress
  useEffect(() => {
    fetch('/data/aws_questions.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data: Question[]) => {
        if (data && data.length > 0) {
          setQuestions(data);
          
          // Initialize with empty attempts
          const emptyAttempts = data.map(() => ({ 
            selectedLetter: null, 
            isCorrect: null, 
            attempted: false 
          }));
          
          // Try to restore progress from localStorage
          try {
            const savedProgress = localStorage.getItem(USER_PROGRESS_KEY);
            
            if (savedProgress) {
              const parsedProgress: UserProgress = JSON.parse(savedProgress);
              
              // Validate the saved data before using it
              if (
                parsedProgress.userAttempts && 
                Array.isArray(parsedProgress.userAttempts) && 
                parsedProgress.userAttempts.length === data.length
              ) {
                setUserAttempts(parsedProgress.userAttempts);
                setCurrentQuestionIndex(parsedProgress.currentQuestionIndex);
                setScore(parsedProgress.score);
                setProgressRestored(true);
                
                // If we're restoring to the last question and it was attempted, show feedback
                if (parsedProgress.userAttempts[parsedProgress.currentQuestionIndex]?.attempted) {
                  setShowFeedback(true);
                  setSelectedAnswerLetter(parsedProgress.userAttempts[parsedProgress.currentQuestionIndex].selectedLetter);
                }
              } else {
                // If saved data is invalid or incompatible, use empty attempts
                setUserAttempts(emptyAttempts);
              }
            } else {
              // No saved progress, use empty attempts
              setUserAttempts(emptyAttempts);
            }
          } catch (e) {
            console.error('Error restoring progress:', e);
            // On error, fall back to empty attempts
            setUserAttempts(emptyAttempts);
          }
        } else {
          setError('No questions loaded. The data might be empty or malformed.');
        }
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Failed to load questions:', error);
        setError(`Failed to load questions: ${error.message}`);
        setIsLoading(false);
      });
  }, []);

  // Save progress to localStorage whenever relevant state changes
  useEffect(() => {
    // Only save if questions are loaded and we have attempts
    if (questions.length > 0 && userAttempts.length > 0) {
      const progressData: UserProgress = {
        currentQuestionIndex,
        userAttempts,
        score,
        lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem(USER_PROGRESS_KEY, JSON.stringify(progressData));
      setProgressSaved(true);
      
      // Reset the saved indicator after 2 seconds
      const timer = setTimeout(() => {
        setProgressSaved(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [currentQuestionIndex, userAttempts, score, questions.length]);

  const currentQuestion = questions[currentQuestionIndex];
  const currentAttempt = userAttempts[currentQuestionIndex];

  const handleAnswerSelection = (value: string) => {
    if (currentAttempt?.attempted) return;
    setSelectedAnswerLetter(value);
    setShowFeedback(false);
  };

  const handleCheckAnswer = () => {
    if (!selectedAnswerLetter || !currentQuestion) return;
    
    const isCorrect = selectedAnswerLetter === currentQuestion.correctAnswerLetter;
    const updatedAttempts = [...userAttempts];
    updatedAttempts[currentQuestionIndex] = {
      selectedLetter: selectedAnswerLetter,
      isCorrect: isCorrect,
      attempted: true,
    };
    
    setUserAttempts(updatedAttempts);
    setShowFeedback(true);
    
    if (isCorrect && !currentAttempt.attempted) {
      setScore(score + 1);
    }
  };

  const navigateToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
    setSelectedAnswerLetter(userAttempts[index]?.selectedLetter || null);
    setShowFeedback(userAttempts[index]?.attempted || false);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      navigateToQuestion(currentQuestionIndex + 1);
    } else {
      setExamFinished(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      navigateToQuestion(currentQuestionIndex - 1);
    }
  };
  
  const restartExam = () => {
    if (window.confirm('Are you sure you want to restart the exam? This will reset all your progress.')) {
      setCurrentQuestionIndex(0);
      setSelectedAnswerLetter(null);
      setUserAttempts(questions.map(() => ({ selectedLetter: null, isCorrect: null, attempted: false })));
      setScore(0);
      setShowFeedback(false);
      setExamFinished(false);
      
      // Clear localStorage
      localStorage.removeItem(USER_PROGRESS_KEY);
    }
  };
  
  const clearProgress = () => {
    if (window.confirm('Are you sure you want to clear all saved progress? This cannot be undone.')) {
      localStorage.removeItem(USER_PROGRESS_KEY);
      window.location.reload();
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center text-xl font-semibold text-slate-300">Loading questions...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-xl font-semibold text-red-400">Error: {error}</div>;
  }

  if (questions.length === 0) {
    return <div className="p-4 text-center text-xl font-semibold text-slate-300">No questions available.</div>;
  }

  if (examFinished) {
    const totalAttempted = userAttempts.filter(a => a.attempted).length;
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-sky-400 text-2xl">Exam Finished!</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-xl text-slate-300 mb-4">Your final score is: <span className="font-bold text-sky-400">{score}</span> out of {questions.length}</p>
            <p className="text-md text-slate-400 mb-6">You attempted {totalAttempted} questions.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={restartExam} className="bg-sky-500 hover:bg-sky-600 text-white">
                Restart Exam
              </Button>
              <Button onClick={clearProgress} variant="outline" className="border-red-500 text-red-400 hover:bg-red-900/20">
                Clear Saved Progress
              </Button>
            </div>
          </CardContent>
        </Card>
        <footer className="mt-8 text-center text-slate-500 text-sm">
          <p>Built by Karl Siaka</p>
          <div className="flex justify-center space-x-4 mt-2">
            <a href="#linkedin-placeholder" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400"><Linkedin size={20} /></a>
            <a href="#youtube-placeholder" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400"><Youtube size={20} /></a>
            <a href="#instagram-placeholder" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400"><Instagram size={20} /></a>
            <a href="#facebook-placeholder" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400"><Facebook size={20} /></a>
          </div>
        </footer>
      </div>
    );
  }
  
  if (!currentQuestion || !currentAttempt) {
      return <div className="p-4 text-center text-xl font-semibold text-slate-300">Loading question data...</div>;
  }

  // Calculate progress percentage
  const attemptedCount = userAttempts.filter(a => a.attempted).length;
  const progressPercentage = Math.round((attemptedCount / questions.length) * 100);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
      {/* Progress notification */}
      {progressSaved && (
        <div className="fixed top-4 right-4 bg-green-800 text-green-100 px-4 py-2 rounded-md flex items-center shadow-lg z-50 animate-fade-in-out">
          <Save className="mr-2 h-4 w-4" />
          Progress saved
        </div>
      )}
      
      {progressRestored && (
        <div className="fixed top-4 left-4 bg-sky-800 text-sky-100 px-4 py-2 rounded-md shadow-lg z-50 mb-4">
          <button 
            onClick={() => setProgressRestored(false)}
            className="absolute top-1 right-1 text-sky-300 hover:text-white"
          >
            ×
          </button>
          <p>Your progress has been restored!</p>
          <p className="text-xs mt-1">You completed {attemptedCount} of {questions.length} questions.</p>
        </div>
      )}
      
      {/* Progress bar */}
      <div className="w-full max-w-3xl mb-4">
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>Progress: {attemptedCount}/{questions.length} questions</span>
          <span>{progressPercentage}% complete</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2.5">
          <div 
            className="bg-sky-600 h-2.5 rounded-full" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
      
      <Card className="w-full max-w-3xl bg-slate-800 border-slate-700 shadow-2xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl text-sky-400">AWS Practice Exam - Question {currentQuestion.id}</CardTitle>
            <Button 
              onClick={clearProgress} 
              variant="ghost" 
              className="text-slate-400 hover:text-red-400 text-xs"
            >
              Reset Progress
            </Button>
          </div>
          <CardDescription className="text-slate-400 pt-1">Domain: {currentQuestion.domain}</CardDescription>
          <p className="text-right text-lg font-semibold text-slate-300">Score: {score}/{questions.length}</p>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-lg text-slate-200 whitespace-pre-wrap leading-relaxed">{currentQuestion.questionText}</p>
          <RadioGroup 
            value={selectedAnswerLetter || ""} 
            onValueChange={handleAnswerSelection}
            disabled={currentAttempt.attempted}
          >
            {currentQuestion.options.map((option) => (
              <div 
                key={option.letter} 
                className={`flex items-center space-x-3 mb-3 p-4 rounded-lg border transition-all duration-150 
                            ${currentAttempt.attempted && option.letter === currentQuestion.correctAnswerLetter ? 'border-green-500 bg-green-900/30' : 
                              currentAttempt.attempted && option.letter === selectedAnswerLetter && option.letter !== currentQuestion.correctAnswerLetter ? 'border-red-500 bg-red-900/30' : 
                              'border-slate-700 hover:bg-slate-700/70'}
                            ${!currentAttempt.attempted ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <RadioGroupItem 
                  value={option.letter} 
                  id={`option-${option.letter}`} 
                  className={`border-slate-600 text-sky-400 focus:ring-sky-500 disabled:opacity-70 
                              ${currentAttempt.attempted && option.letter === currentQuestion.correctAnswerLetter ? 'ring-2 ring-green-500' : ''}
                              ${currentAttempt.attempted && option.letter === selectedAnswerLetter && option.letter !== currentQuestion.correctAnswerLetter ? 'ring-2 ring-red-500' : ''}`}
                  disabled={currentAttempt.attempted}
                />
                <Label htmlFor={`option-${option.letter}`} className={`text-slate-300 text-base flex-1 ${!currentAttempt.attempted ? 'cursor-pointer' : 'cursor-default'}`}>
                  {option.letter}) {option.text}
                </Label>
              </div>
            ))}
          </RadioGroup>

          {showFeedback && currentAttempt.attempted && (
            <Alert 
              variant={currentAttempt.isCorrect ? "default" : "destructive"} 
              className={`mt-6 ${currentAttempt.isCorrect ? 'bg-green-900/50 border-green-700' : 'bg-red-900/50 border-red-700'}`}
            >
              {currentAttempt.isCorrect ? <CheckCircle className="h-5 w-5 text-green-400" /> : <XCircle className="h-5 w-5 text-red-400" />}
              <AlertTitle className={currentAttempt.isCorrect ? "text-green-300" : "text-red-300"}>
                {currentAttempt.isCorrect ? "Correct!" : "Incorrect"}
              </AlertTitle>
              <AlertDescription className="text-slate-300 mt-2 whitespace-pre-wrap leading-relaxed">
                {!currentAttempt.isCorrect && (
                  <p className="mb-2 font-semibold">Your answer: {selectedAnswerLetter}) {currentQuestion.options.find(o=>o.letter === selectedAnswerLetter)?.text}</p>
                )}
                <p className="mb-2 font-semibold">Correct answer: {currentQuestion.correctAnswerLetter}) {currentQuestion.options.find(o=>o.letter === currentQuestion.correctAnswerLetter)?.text}</p>
                <h4 className="font-semibold mt-3 mb-1 text-slate-200">Explanation:</h4>
                {currentQuestion.explanation}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between items-center pt-6 gap-4">
          <Button 
            onClick={handlePreviousQuestion} 
            disabled={currentQuestionIndex === 0}
            variant="outline"
            className="w-full sm:w-auto bg-slate-700 hover:bg-slate-600 border-slate-600 text-sky-400 hover:text-sky-300 disabled:opacity-50"
          >
            Previous
          </Button>
          {!currentAttempt.attempted && (
            <Button 
              onClick={handleCheckAnswer} 
              disabled={!selectedAnswerLetter}
              className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold disabled:opacity-50"
            >
              Check Answer
            </Button>
          )}
          {(currentAttempt.attempted || showFeedback) && (
            <Button 
              onClick={handleNextQuestion}
              className="w-full sm:w-auto bg-sky-500 hover:bg-sky-600 text-white"
            >
              {currentQuestionIndex === questions.length - 1 ? 'Finish Exam' : 'Next Question'}
            </Button>
          )}
        </CardFooter>
      </Card>
      <p className="mt-6 text-sm text-slate-500">Question {currentQuestionIndex + 1} of {questions.length}</p>
      <footer className="mt-8 text-center text-slate-500 text-sm">
        <p>Built by Karl Siaka</p>
        <div className="flex justify-center space-x-4 mt-2">
          {/* Placeholder links - User should replace # with actual URLs */}
          <a href="#linkedin-placeholder" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile" className="hover:text-sky-400"><Linkedin size={20} /></a>
          <a href="#youtube-placeholder" target="_blank" rel="noopener noreferrer" aria-label="YouTube Channel" className="hover:text-sky-400"><Youtube size={20} /></a>
          <a href="#instagram-placeholder" target="_blank" rel="noopener noreferrer" aria-label="Instagram Profile" className="hover:text-sky-400"><Instagram size={20} /></a>
          <a href="#facebook-placeholder" target="_blank" rel="noopener noreferrer" aria-label="Facebook Profile" className="hover:text-sky-400"><Facebook size={20} /></a>
        </div>
      </footer>
    </div>
  );
}

export default App;
