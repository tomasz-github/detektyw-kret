import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CriminalCase } from '../types/game';
import { sound } from '../utils/sound';
import { Trophy, KeyRound, ArrowRight, Copy, Check, Sparkles } from 'lucide-react';

interface CaseVictoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseSolved: CriminalCase;
  onProceedNextCase?: () => void;
  hasNextCase: boolean;
}

export const CaseVictoryModal: React.FC<CaseVictoryModalProps> = ({
  isOpen,
  onClose,
  caseSolved,
  onProceedNextCase,
  hasNextCase,
}) => {
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    if (isOpen) {
      sound.playVictory();
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#fbbf24', '#38bdf8', '#818cf8', '#22c55e'],
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const nextCode = caseSolved.nextCaseCode || '55219';

  const handleCopyCode = () => {
    sound.playClick();
    navigator.clipboard?.writeText(nextCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in zoom-in-95 duration-200">
      <div className="relative w-full max-w-lg bg-[#27150a] border-3 border-[#f59e0b] rounded-3xl p-6 sm:p-8 text-[#fef3c7] shadow-2xl text-center">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-[#b45309] to-[#fbbf24] p-1 flex items-center justify-center shadow-lg mb-4">
          <div className="w-full h-full bg-[#1c0e05] rounded-2xl flex items-center justify-center text-[#facc15]">
            <Trophy className="w-10 h-10 animate-bounce" />
          </div>
        </div>

        <span className="text-xs uppercase tracking-widest font-bold text-[#f59e0b] flex items-center justify-center gap-1.5 mb-1">
          <Sparkles className="w-4 h-4" /> Sprawa Rozwiązana! <Sparkles className="w-4 h-4" />
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold font-['Fredoka'] text-white">
          {caseSolved.title}
        </h2>

        <div className="my-5 p-4 rounded-2xl bg-[#170c05] border border-[#78350f] text-left text-xs sm:text-sm leading-relaxed text-[#fde68a]">
          <p className="font-semibold text-white mb-1.5">Raport Końcowy Detektywa Kreta:</p>
          <p>{caseSolved.victoryExplanation}</p>
        </div>

        {/* 5-Digit Unlock Code Banner */}
        <div className="p-4 rounded-2xl bg-[#3f2008] border-2 border-dashed border-[#f59e0b] mb-6">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase text-[#fef08a] mb-1">
            <KeyRound className="w-4 h-4 text-[#facc15]" />
            <span>Kod odblokowujący kolejny etap:</span>
          </div>
          <div className="flex items-center justify-center gap-3">
            <span className="font-mono text-3xl sm:text-4xl font-extrabold tracking-[0.3em] text-white">
              {nextCode}
            </span>
            <button
              onClick={handleCopyCode}
              title="Kopiuj kod"
              className="p-2 rounded-xl bg-[#78350f] hover:bg-[#b45309] text-white transition-colors"
            >
              {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
          <p className="text-[11px] text-[#fed7aa]/80 mt-1.5">
            Zapisz ten 5-cyfrowy kod! Po resecie gry wpiszesz go w menu, by od razu przejść do kolejnej sprawy.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-3 rounded-2xl bg-[#1c1109] hover:bg-[#382011] text-[#fef3c7] font-semibold text-xs border border-[#78350f] transition-all"
          >
            Pozostań w tej norze
          </button>
          {hasNextCase && onProceedNextCase ? (
            <button
              onClick={() => {
                sound.playClick();
                onProceedNextCase();
              }}
              className="px-7 py-3 rounded-2xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] hover:from-[#b45309] hover:to-[#d97706] text-white font-bold text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>Następna Sprawa</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="px-7 py-3 rounded-2xl bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-white font-bold text-sm shadow-xl"
            >
              Ukończono Wszystkie Sprawy Kreciego Królestwa!
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
