import React, { useState } from 'react';
import { ALL_CASES } from '../data/cases';
import { sound } from '../utils/sound';
import { KeyRound, X, Check, AlertCircle } from 'lucide-react';

interface CodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadCaseByCode: (code: string) => boolean;
  currentCaseCode: string;
}

export const CodeModal: React.FC<CodeModalProps> = ({
  isOpen,
  onClose,
  onLoadCaseByCode,
  currentCaseCode,
}) => {
  const [inputCode, setInputCode] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputCode.trim();
    if (clean.length !== 5) {
      setErrorMsg('Wprowadź dokładnie 5-cyfrowy kod sprawy!');
      return;
    }

    const success = onLoadCaseByCode(clean);
    if (success) {
      sound.playClueFound();
      onClose();
    } else {
      sound.playClick();
      setErrorMsg('Nieprawidłowy kod śledztwa. Sprawdź poprawność cyfr!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-[#25160b] border-2 border-[#b45309] rounded-3xl p-6 text-[#fef3c7] shadow-2xl">
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-1 rounded-lg text-[#fcd34d] hover:bg-[#78350f] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-[#78350f] border-2 border-[#d97706] flex items-center justify-center text-[#fde68a] shadow-inner">
            <KeyRound className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-['Fredoka'] text-white">Hasło Śledztwa</h3>
            <span className="text-xs text-[#fbbf24]">System 5-cyfrowych kodów etapów</span>
          </div>
        </div>

        <p className="text-xs text-[#fde68a]/90 leading-relaxed bg-[#1c1109] p-3 rounded-xl border border-[#78350f] mb-4">
          W tej grze nie ma tradycyjnego zapisu stanu. Po rozwiązaniu zagadki otrzymujesz 5-cyfrowy kod, który pozwala wrócić do rozpoczętego etapu w dowolnej chwili!
        </p>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-[#7f1d1d] border border-[#ef4444] text-[#fee2e2] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#f59e0b] mb-1.5">
              Wprowadź 5-cyfrowy kod sprawy:
            </label>
            <input
              type="text"
              maxLength={5}
              value={inputCode}
              onChange={(e) => {
                setInputCode(e.target.value.replace(/\D/g, ''));
                setErrorMsg(null);
              }}
              placeholder="np. 48291"
              autoFocus
              className="w-full text-center tracking-[0.5em] text-2xl font-bold font-mono py-3 px-4 rounded-xl bg-[#120a05] border-2 border-[#b45309] text-white focus:outline-hidden focus:border-[#f59e0b] placeholder:text-[#78350f]"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-[#a8a29e] px-1">
            <span>Kod aktualnego etapu:</span>
            <span className="font-mono font-bold text-[#fbbf24] bg-[#120a05] px-2.5 py-1 rounded-md border border-[#78350f]">
              {currentCaseCode}
            </span>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="px-4 py-2.5 rounded-xl bg-[#1c1109] hover:bg-[#382011] text-[#fef3c7] text-xs font-medium border border-[#78350f]"
            >
              Anuluj
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#b45309] hover:from-[#b45309] hover:to-[#92400e] text-white font-bold text-xs shadow-md active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              Załaduj Sprawę
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
