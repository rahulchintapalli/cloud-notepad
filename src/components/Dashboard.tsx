import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, Folder, Settings, Search, Plus, 
  TerminalSquare, BookOpen, Presentation, LayoutTemplate, ChevronLeft, Cloud
} from 'lucide-react';
import { UserPreferences } from '../App';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface DashboardProps {
  preferences: UserPreferences;
  onBack: () => void;
  syncCode: string;
}

export default function Dashboard({ preferences, onBack, syncCode }: DashboardProps) {
  const [activeTabIdx, setActiveTabIdx] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [notes, setNotes] = useState<Record<string, { title: string, content: string }>>({});

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "workspaces", syncCode), (docSnap) => {
      if (docSnap.exists() && !isTyping) {
        const data = docSnap.data();
        if (data.notes) {
          setNotes(data.notes);
        }
      }
    });
    return () => unsub();
  }, [syncCode, isTyping]);

  useEffect(() => {
    if (Object.keys(notes).length === 0) return;
    
    const timeoutId = setTimeout(() => {
       setDoc(doc(db, "workspaces", syncCode), { notes }, { merge: true }).then(() => {
         setIsTyping(false);
       });
    }, 800);
    
    return () => clearTimeout(timeoutId);
  }, [notes, syncCode]);
  // Determine folders based on role
  let folders = [
    { icon: FileText, label: 'All Notes' },
    { icon: Folder, label: 'Personal' },
  ];

  if (preferences.role === 'student') {
    folders = [
      { icon: BookOpen, label: 'Study Notes' },
      { icon: FileText, label: 'Assignments' },
      { icon: Search, label: 'Exam Preparation' },
      { icon: Presentation, label: 'Lecture Notes' },
    ];
  } else if (preferences.role === 'developer') {
    folders = [
      { icon: TerminalSquare, label: 'Code Snippets' },
      { icon: Settings, label: 'API Keys' },
      { icon: TerminalSquare, label: 'Terminal Commands' },
      { icon: LayoutTemplate, label: 'JSON Formatter' },
      { icon: FileText, label: 'Markdown Mode' },
    ];
  } else if (preferences.role === 'writer') {
    folders = [
      { icon: FileText, label: 'Drafts' },
      { icon: Search, label: 'Ideas' },
      { icon: BookOpen, label: 'Articles' },
      { icon: LayoutTemplate, label: 'Character Counter' },
    ];
  } else if (preferences.role === 'business') {
    folders = [
      { icon: Presentation, label: 'Meeting Notes' },
      { icon: Folder, label: 'Projects' },
      { icon: FileText, label: 'To-Do Lists' },
      { icon: BookOpen, label: 'Documents' },
    ];
  }

  const greeting = preferences.name ? `Welcome back, ${preferences.name}.` : 'Welcome back.';
  
  const activeFolder = folders[activeTabIdx].label;
  const currentNote = notes[activeFolder] || { title: '', content: '' };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsTyping(true);
    setNotes(prev => ({
      ...prev,
      [activeFolder]: { ...prev[activeFolder], title: e.target.value, content: prev[activeFolder]?.content || '' }
    }));
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setIsTyping(true);
    setNotes(prev => ({
      ...prev,
      [activeFolder]: { ...prev[activeFolder], content: e.target.value, title: prev[activeFolder]?.title || '' }
    }));
  };

  return (
    <motion.div 
      style={{ display: 'flex', width: '100%', height: '100%' }}
      initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
    >
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header" style={{ padding: '16px 20px' }}>
          <button 
            onClick={onBack} 
            className="btn-secondary" 
            style={{ 
              display: 'flex', alignItems: 'center', gap: '6px', 
              padding: '6px 12px', fontSize: '13px', marginBottom: '16px', 
              background: 'transparent', border: 'none', color: 'var(--text-secondary)'
            }}
          >
            <ChevronLeft size={16} /> Setup
          </button>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 600 }}>WORKSPACE</h3>
            <button style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
              <Plus size={18} />
            </button>
          </div>
        </div>
        <div className="sidebar-content">
          {folders.map((f, i) => {
            const Icon = f.icon;
            return (
              <div 
                key={i} 
                className={`sidebar-item ${i === activeTabIdx ? 'active' : ''}`}
                onClick={() => setActiveTabIdx(i)}
              >
                <Icon size={18} />
                <span>{f.label}</span>
              </div>
            );
          })}
          <div style={{ marginTop: 'auto', padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', margin: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>
              <Cloud size={16} color="var(--accent-color)" /> Sync Code
            </div>
            <div style={{ fontSize: '18px', letterSpacing: '2px', fontFamily: 'monospace', color: 'var(--accent-color)' }}>
              {syncCode}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Use this code to sync notes on other devices.
            </div>
          </div>
        </div>
        <div style={{ padding: '16px', borderTop: '1px solid var(--card-border)' }}>
          <div className="sidebar-item">
            <Settings size={18} />
            <span>Settings</span>
          </div>
        </div>
      </div>

      {/* Editor Area */}
      <div className="editor-area">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          style={{ display: 'flex', flexDirection: 'column', flex: 1 }}
        >
          <div style={{ color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '14px' }}>
            {greeting}
          </div>
          <input 
            className="editor-title"
            placeholder="Untitled Note"
            value={currentNote.title}
            onChange={handleTitleChange}
          />
          <textarea 
            className="editor-content"
            placeholder="Start typing..."
            value={currentNote.content}
            onChange={handleContentChange}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
