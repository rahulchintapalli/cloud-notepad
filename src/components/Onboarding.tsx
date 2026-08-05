import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, Code, Palette, PenTool, Briefcase, 
  Microscope, Video, BookOpen, Rocket, User, HelpCircle,
  FileText, Terminal, Library, Quote,
  ListTodo, PenLine, Lightbulb, Database, ClipboardList, ChevronLeft
} from 'lucide-react';

const ROLES = [
  { id: 'student', label: 'Student', icon: GraduationCap },
  { id: 'developer', label: 'Software Developer', icon: Code },
  { id: 'designer', label: 'Designer', icon: Palette },
  { id: 'writer', label: 'Writer', icon: PenTool },
  { id: 'business', label: 'Business Professional', icon: Briefcase },
  { id: 'researcher', label: 'Researcher', icon: Microscope },
  { id: 'creator', label: 'Content Creator', icon: Video },
  { id: 'teacher', label: 'Teacher', icon: BookOpen },
  { id: 'freelancer', label: 'Freelancer', icon: Rocket },
  { id: 'personal', label: 'Personal Use', icon: User },
  { id: 'other', label: 'Other', icon: HelpCircle },
];

const USE_CASES = [
  { id: 'quick', label: 'Quick Notes', icon: FileText },
  { id: 'code', label: 'Programming & Code', icon: Terminal },
  { id: 'study', label: 'Study Notes', icon: Library },
  { id: 'meeting', label: 'Meeting Notes', icon: Briefcase },
  { id: 'research', label: 'Research', icon: Microscope },
  { id: 'journal', label: 'Journal', icon: Quote },
  { id: 'tasks', label: 'Daily Tasks', icon: ListTodo },
  { id: 'articles', label: 'Writing Articles', icon: PenLine },
  { id: 'brainstorm', label: 'Brainstorming', icon: Lightbulb },
  { id: 'knowledge', label: 'Knowledge Base', icon: Database },
  { id: 'clipboard', label: 'Clipboard Manager', icon: ClipboardList },
  { id: 'other', label: 'Other', icon: HelpCircle },
];

interface OnboardingProps {
  onComplete: (prefs: any) => void;
  onSkip: () => void;
  onSync: (code: string) => void;
}

export default function Onboarding({ onComplete, onSkip, onSync }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<string | null>(null);
  const [useCase, setUseCase] = useState<string | null>(null);
  const [name, setName] = useState('');

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
    else onComplete({ role, useCase, name });
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSkip = () => {
    onSkip();
  };

  const pageVariants = {
    initial: { opacity: 0, scale: 0.95, filter: 'blur(10px)' },
    in: { opacity: 1, scale: 1, filter: 'blur(0px)' },
    out: { opacity: 0, scale: 1.05, filter: 'blur(10px)' },
  };

  const pageTransition = {
    type: 'spring',
    stiffness: 100,
    damping: 20,
    mass: 1,
  };

  return (
    <motion.div 
      className="glass"
      style={{ 
        position: 'absolute', inset: 0, display: 'flex', 
        alignItems: 'center', justifyContent: 'center',
        padding: '2rem', background: 'var(--bg-color)' 
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(20px)', scale: 1.1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div style={{ position: 'absolute', top: 40, right: 40, display: 'flex', gap: '16px', alignItems: 'center' }}>
        <input 
          placeholder="Have a Sync Code?"
          className="input-field"
          style={{ padding: '10px 16px', fontSize: '14px', width: '200px' }}
          onChange={(e) => {
            if (e.target.value.length >= 6) {
              onSync(e.target.value.toUpperCase().trim());
            }
          }}
        />
        <button onClick={handleSkip} className="btn-secondary">Skip</button>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            initial="initial" animate="in" exit="out"
            variants={pageVariants} transition={pageTransition}
            style={{ maxWidth: 800, width: '100%', textAlign: 'center' }}
          >
            <h1 style={{ fontSize: '3rem', fontWeight: 600, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
              Welcome to Your Cloud Notepad
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '4rem' }}>
              Capture ideas, code, notes, and anything important—securely, instantly, and beautifully.
            </p>
            
            <h2 style={{ fontSize: '1.5rem', fontWeight: 500, marginBottom: '2rem' }}>
              What best describes you?
            </h2>
            <div style={{ 
              display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', 
              gap: '16px', marginBottom: '3rem'
            }}>
              {ROLES.map(r => {
                const Icon = r.icon;
                const isSelected = role === r.id;
                return (
                  <div 
                    key={r.id} 
                    className={`card ${isSelected ? 'selected' : ''}`}
                    onClick={() => { setRole(r.id); setTimeout(nextStep, 400); }}
                  >
                    <Icon size={32} color={isSelected ? 'var(--accent-color)' : 'white'} />
                    <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{r.label}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial="initial" animate="in" exit="out"
            variants={pageVariants} transition={pageTransition}
            style={{ maxWidth: 800, width: '100%', textAlign: 'center' }}
          >
            <div style={{ position: 'absolute', top: 40, left: 40 }}>
              <button onClick={prevStep} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}>
                <ChevronLeft size={20} /> Back
              </button>
            </div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 600, marginBottom: '1rem' }}>
              What will you mainly use this notepad for?
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '3rem' }}>
              We'll personalize your workspace based on this.
            </p>
            <div style={{ 
              display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
              gap: '16px', marginBottom: '3rem'
            }}>
              {USE_CASES.map(u => {
                const Icon = u.icon;
                const isSelected = useCase === u.id;
                return (
                  <div 
                    key={u.id} 
                    className={`card ${isSelected ? 'selected' : ''}`}
                    onClick={() => { setUseCase(u.id); setTimeout(nextStep, 400); }}
                  >
                    <Icon size={32} color={isSelected ? 'var(--accent-color)' : 'white'} />
                    <span style={{ fontSize: '1rem', fontWeight: 500 }}>{u.label}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            key="step3"
            initial="initial" animate="in" exit="out"
            variants={pageVariants} transition={pageTransition}
            style={{ maxWidth: 600, width: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <div style={{ position: 'absolute', top: 40, left: 40, transform: 'translateX(-1in)' }}>
              <button onClick={prevStep} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}>
                <ChevronLeft size={20} /> Back
              </button>
            </div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 600, marginBottom: '1rem' }}>
              What is your name?
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '3rem' }}>
              Just so we know what to call you. (Optional)
            </p>
            
            <input 
              type="text"
              className="input-field"
              placeholder="Your Name"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') nextStep(); }}
              autoFocus
            />
            
            <div style={{ marginTop: '3rem' }}>
              <button className="btn-primary" onClick={nextStep} style={{ padding: '16px 40px', fontSize: '1.2rem' }}>
                Enter Workspace
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
