import React, { useState } from 'react';
import { Clue, CriminalCase, Suspect } from '../types/game';
import { sound } from '../utils/sound';
import { SPRITE_URLS } from '../utils/spriteAssets';
import { BookOpen, Users, HelpCircle, CheckCircle2, AlertCircle, X, Search, Sparkles } from 'lucide-react';

interface NotebookModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCase: CriminalCase;
  discoveredClueIds: string[];
  onSolveCase: (culpritId: string, evidenceId: string) => void;
}

export const NotebookModal: React.FC<NotebookModalProps> = ({
  isOpen,
  onClose,
  currentCase,
  discoveredClueIds,
  onSolveCase,
}) => {
  const [activeTab, setActiveTab] = useState<'clues' | 'suspects' | 'deduction'>('clues');
  const [selectedCulpritId, setSelectedCulpritId] = useState<string>('');
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string>('');
  const [deductionFeedback, setDeductionFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const discoveredClues = currentCase.clues.filter((c) => discoveredClueIds.includes(c.id));

  const handlePresentAccusation = () => {
    if (!selectedCulpritId || !selectedEvidenceId) {
      setDeductionFeedback('Wybierz podejrzanego oraz kluczowy dowód z listy!');
      return;
    }

    const isEvidenceValid =
      selectedEvidenceId === currentCase.requiredEvidenceId ||
      (currentCase.validEvidenceIds && currentCase.validEvidenceIds.includes(selectedEvidenceId));

    if (selectedCulpritId === currentCase.culpritId && isEvidenceValid) {
      // Victory!
      onSolveCase(selectedCulpritId, selectedEvidenceId);
    } else {
      sound.playClick();
      setDeductionFeedback(
        'Hmm... ta teoria nie trzyma się kupy. Podejrzany ma mocne alibi lub ten dowód go nie obciąża. Zbadaj nory i porozmawiaj z innymi mieszkańcami!'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl h-[88vh] max-h-[720px] bg-[#22150c] border-2 border-[#b45309] rounded-3xl flex flex-col text-[#fef3c7] shadow-2xl overflow-hidden">
        {/* Leather Notebook Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#1a0f07] border-b border-[#78350f]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#78350f] border border-[#d97706] flex items-center justify-center text-[#fcd34d]">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-['Fredoka'] text-white">Notatnik Detektywa Kreta</h2>
              <div className="text-xs text-[#fbbf24] flex items-center gap-2">
                <span>{currentCase.title}</span>
                <span>·</span>
                <span>{discoveredClues.length} / {currentCase.clues.length} wskazówek</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playPageTurn();
              onClose();
            }}
            className="p-1.5 rounded-lg text-[#fcd34d] hover:bg-[#78350f] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#78350f] bg-[#170c06] px-6 gap-2">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('clues');
            }}
            className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'clues'
                ? 'border-[#f59e0b] text-[#f59e0b]'
                : 'border-transparent text-[#a8a29e] hover:text-[#fef3c7]'
            }`}
          >
            <Search className="w-4 h-4" />
            Odkryte Wskazówki ({discoveredClues.length})
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('suspects');
            }}
            className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'suspects'
                ? 'border-[#f59e0b] text-[#f59e0b]'
                : 'border-transparent text-[#a8a29e] hover:text-[#fef3c7]'
            }`}
          >
            <Users className="w-4 h-4" />
            Podejrzani ({currentCase.suspects.length})
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('deduction');
            }}
            className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'deduction'
                ? 'border-[#f59e0b] text-[#f59e0b]'
                : 'border-transparent text-[#a8a29e] hover:text-[#fef3c7]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Tablica Dedukcji & Rozwiązanie
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#26170d]/90">
          {activeTab === 'clues' && (
            <div className="space-y-4">
              <div className="bg-[#1a0f07] p-3.5 rounded-xl border border-[#78350f] text-xs text-[#fde68a]">
                💡 Przeszukuj tunele, rozmawiaj ze zwierzętami w Tawernie i odwiedzaj Czarodziejkę Sowę w nocy, aby zdobyć komplet dowodów!
              </div>

              {discoveredClues.length === 0 ? (
                <div className="text-center py-12 text-[#a8a29e]">
                  <Search className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Nie odkryłeś jeszcze żadnych wskazówek.</p>
                  <p className="text-xs mt-1">Zbadaj spiżarnię, wyjścia z tuneli lub zagadaj do gospodarza tawerny!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {discoveredClues.map((clue) => (
                    <div
                      key={clue.id}
                      className="p-4 rounded-xl bg-[#1c1109] border border-[#78350f] hover:border-[#b45309] transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-[11px] font-semibold uppercase text-[#f59e0b]">
                            {clue.locationName}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] bg-[#78350f] text-[#fef3c7]">
                            {clue.category}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-white font-['Fredoka']">{clue.title}</h4>
                        <p className="text-xs text-[#fef3c7]/80 mt-1 leading-relaxed">
                          "{clue.description}"
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-[#78350f]/60 flex items-center justify-between text-[11px] text-[#fbbf24]">
                        <span>✓ Potwierdzony dowód</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'suspects' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentCase.suspects.map((suspect) => (
                <div
                  key={suspect.id}
                  className="p-4 rounded-2xl bg-[#1c1109] border border-[#78350f] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      {suspect.species.includes('Lis') ? (
                        <img
                          src={SPRITE_URLS.lis}
                          alt={suspect.name}
                          className="w-14 h-14 rounded-xl object-cover border-2 border-[#ea580c] shadow-md shrink-0"
                        />
                      ) : suspect.species.includes('Jeż') ? (
                        <img
                          src={SPRITE_URLS.jez}
                          alt={suspect.name}
                          className="w-14 h-14 rounded-xl object-cover border-2 border-[#a8a29e] shadow-md shrink-0"
                        />
                      ) : suspect.species.includes('Borsuk') ? (
                        <img
                          src={SPRITE_URLS.borsuk}
                          alt={suspect.name}
                          className="w-14 h-14 rounded-xl object-cover border-2 border-[#64748b] shadow-md shrink-0"
                        />
                      ) : (
                        <div
                          className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-inner font-bold"
                          style={{ backgroundColor: suspect.avatarColor }}
                        >
                          {suspect.species.includes('Szczur') ? '🐀' : '🦅'}
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-white text-base font-['Fredoka']">{suspect.name}</h4>
                        <span className="text-xs text-[#f59e0b]">{suspect.title}</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="bg-[#120a05] p-2.5 rounded-lg border border-[#78350f]/60">
                        <span className="font-semibold text-[#f87171] block">Podejrzany Motyw:</span>
                        <p className="text-[#fef3c7]/90 mt-0.5">{suspect.motive}</p>
                      </div>
                      <div className="bg-[#120a05] p-2.5 rounded-lg border border-[#78350f]/60">
                        <span className="font-semibold text-[#60a5fa] block">Podane Alibi:</span>
                        <p className="text-[#fef3c7]/90 mt-0.5">{suspect.alibi}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-2 border-t border-[#78350f]/60 text-center">
                    <span className="text-[11px] text-[#a8a29e]">Status: Obserwowany</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'deduction' && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="text-center space-y-1">
                <h3 className="text-xl font-bold font-['Fredoka'] text-white">Rozstrzygnięcie Śledztwa</h3>
                <p className="text-xs text-[#fde68a]">
                  Połącz zebrane fakty, wytypuj sprawcę i wskaż niepodważalny dowód jego winy.
                </p>
              </div>

              {deductionFeedback && (
                <div className="p-3.5 rounded-xl bg-[#7f1d1d] border border-[#ef4444] text-[#fee2e2] text-xs flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{deductionFeedback}</span>
                </div>
              )}

              {/* Step 1: Choose Culprit */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#f59e0b]">
                  1. Kogo oskarżasz o popełnienie przestępstwa?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {currentCase.suspects.map((suspect) => {
                    const isSelected = selectedCulpritId === suspect.id;
                    return (
                      <button
                        key={suspect.id}
                        onClick={() => {
                          sound.playClick();
                          setSelectedCulpritId(suspect.id);
                        }}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-[#d97706] border-white text-white shadow-lg'
                            : 'bg-[#1c1109] border-[#78350f] text-[#fef3c7] hover:bg-[#2e180d]'
                        }`}
                      >
                        <div className="font-bold text-sm font-['Fredoka']">{suspect.name}</div>
                        <div className="text-[11px] opacity-80">{suspect.species}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Choose Decisive Evidence */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#f59e0b]">
                  2. Jaki dowód bezspornie obciąża sprawcę?
                </label>
                {discoveredClues.length === 0 ? (
                  <div className="p-4 rounded-xl bg-[#1c1109] border border-[#78350f] text-center text-xs text-[#a8a29e]">
                    Musisz najpierw odkryć przynajmniej jedną wskazówkę w norach, by przedstawić zarzuty!
                  </div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {discoveredClues.map((clue) => {
                      const isSelected = selectedEvidenceId === clue.id;
                      return (
                        <button
                          key={clue.id}
                          onClick={() => {
                            sound.playClick();
                            setSelectedEvidenceId(clue.id);
                          }}
                          className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-[#b45309] border-white text-white shadow-md'
                              : 'bg-[#1c1109] border-[#78350f] text-[#fef3c7] hover:bg-[#2e180d]'
                          }`}
                        >
                          <div>
                            <span className="font-bold text-xs font-['Fredoka']">{clue.title}</span>
                            <p className="text-[11px] opacity-80 truncate max-w-md">{clue.description}</p>
                          </div>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-white shrink-0 ml-2" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-center">
                <button
                  onClick={handlePresentAccusation}
                  disabled={discoveredClues.length === 0}
                  className="px-8 py-3 rounded-2xl bg-gradient-to-r from-[#d97706] to-[#b45309] hover:from-[#b45309] hover:to-[#92400e] text-white font-bold text-sm shadow-xl active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles className="w-5 h-5 text-[#fef08a]" />
                  Przedstaw Raport Śledczy i Zamknij Sprawę!
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
