import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import App from './App';
import Contact from './Contact';
import { Button } from '@/components/ui/button';
import { Home, Mail, Menu, X } from 'lucide-react';

function Main() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [basePath, setBasePath] = useState('');

  // Determine base path for GitHub Pages
  useEffect(() => {
    // For GitHub Pages, we need to handle the repository name in the URL
    // This is a simplified approach - you might need to adjust based on your actual deployment
    const path = process.env.NODE_ENV === 'production' 
      ? '/aws-practice-exam' // Replace with your actual repository name
      : '';
    setBasePath(path);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <Router basename={basePath}>
      <div className="min-h-screen bg-slate-900 text-white">
        {/* Navigation Header */}
        <header className="bg-slate-800 border-b border-slate-700 py-3 px-4 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Link to="/" className="text-sky-400 font-bold text-xl">AWS Practice Exam</Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-4">
              <Link to="/">
                <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-700">
                  <Home className="mr-2 h-4 w-4" />
                  Exam
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-700">
                  <Mail className="mr-2 h-4 w-4" />
                  Contact
                </Button>
              </Link>
            </nav>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-slate-300 hover:text-white p-2"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          
          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden mt-2 py-2 border-t border-slate-700">
              <Link to="/" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700">
                  <Home className="mr-2 h-4 w-4" />
                  Exam
                </Button>
              </Link>
              <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700">
                  <Mail className="mr-2 h-4 w-4" />
                  Contact
                </Button>
              </Link>
            </nav>
          )}
        </header>
        
        {/* Main Content */}
        <main>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<App />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default Main;
