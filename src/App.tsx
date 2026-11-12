import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ALL_CASES } from './data/cases';
import { Clue, CriminalCase, GameTime, OwlHintOption } from './types/game';
import { sound } from './utils/sound';
import { TitleScreen } from './components/TitleScreen';
import { GameCanvas } from './components/GameCanvas';
import { HUD } from './components/HUD';
import { DialogueModal } from './components/DialogueModal';
import { NotebookModal } from './components/NotebookModal';
import { SleepModal } from './components/SleepModal';
import { CodeModal } from './components/CodeModal';
import { CaseVictoryModal } from './components/CaseVictoryModal';
import { HelpModal } from './components/HelpModal';
import { TouchControls } from './components/TouchControls';

type ScreenState = 'TITLE_SCREEN' | 'PLAYING';

export default function App() {
  const [screen, setScreen] = useState<ScreenState>('TITLE_SCREEN');

  // Current criminal case
  const [caseIndex, setCaseIndex] = useState<number>(0);
  const currentCase = useMemo(() => ALL_CASES[caseIndex] || ALL_CASES[0], [caseIndex]);

  // Discovered clues in current case
  const [discoveredClueIds, setDiscoveredClueIds] = useState<string[]>([]);

  // Sowa selected hint
  const [usedOwlHintId, setUsedOwlHintId] = useState<string | undefined>(undefined);

  // In-game dynamic clock
  const [gameTime, setGameTime] = useState<GameTime>({
    day: 1,
    hour: 14,
    minute: 0,
  });

  // Modals state
  const [isNotebookOpen, setIsNotebookOpen] = useState(false);
  const [isSleepModalOpen, setIsSleepModalOpen] = useState(false);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [isVictoryModalOpen, setIsVictoryModalOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Active dialogue / clue inspection
  const [dialogueState, setDialogueState] = useState<{
    isOpen: boolean;
    npcId?: string;
    clue?: Clue;
  }>({ isOpen: false });

  // Sound state
  const [isMuted, setIsMuted] = useState(false);

  // Keyboard held keys
  const [heldKeys, setHeldKeys] = useState<{ [key: string]: boolean }>({});
  const [actionTriggered, setActionTriggered] = useState(false);
  const [proximityPrompt, setProximityPrompt] = useState<string | null>(null);

  // Natural clock passage (1 in-game minute every 900ms)
  useEffect(() => {
    if (screen !== 'PLAYING') return;

    const timer = setInterval(() => {
      setGameTime((prev) => {
        let newMin = prev.minute + 1;
        let newHour = prev.hour;
        let newDay = prev.day;

        if (newMin >= 60) {
          newMin = 0;
          newHour += 1;
          if (newHour >= 24) {
            newHour = 0;
            newDay += 1;
          }
        }
        return { day: newDay, hour: newHour, minute: newMin };
      });
    }, 900);

    return () => clearInterval(timer);
  }, [screen]);

  // Keyboard event listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger game keys if typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      setHeldKeys((prev) => ({ ...prev, [e.code]: true }));

      // Shortcuts
      if (e.code === 'KeyN') {
        sound.playPageTurn();
        setIsNotebookOpen((v) => !v);
      } else if (e.code === 'KeyZ') {
        sound.playClick();
        setIsSleepModalOpen((v) => !v);
      } else if (e.code === 'KeyK') {
        sound.playClick();
        setIsCodeModalOpen((v) => !v);
      } else if (e.code === 'KeyE' || e.code === 'Space') {
        setActionTriggered(true);
      } else if (e.code === 'Escape') {
        setIsNotebookOpen(false);
        setIsSleepModalOpen(false);
        setIsCodeModalOpen(false);
        setIsHelpOpen(false);
        setDialogueState({ isOpen: false });
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setHeldKeys((prev) => ({ ...prev, [e.code]: false }));
    };

    const handleBlur = () => {
      setHeldKeys({});
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  // Sleep handler
  const handleSleep = (hoursToAdd: number) => {
    setGameTime((prev) => {
      let newHour = prev.hour + hoursToAdd;
      let newDay = prev.day;
      while (newHour >= 24) {
        newHour -= 24;
        newDay += 1;
      }
      return { day: newDay, hour: newHour, minute: 0 };
    });
  };

  // Discover clue
  const handleDiscoverClue = (clueId: string) => {
    if (!discoveredClueIds.includes(clueId)) {
      setDiscoveredClueIds((prev) => [...prev, clueId]);
    }
  };

  // Select Owl hint - only 1 hint allowed per case!
  const handleSelectOwlHint = (hint: OwlHintOption) => {
    if (usedOwlHintId) return; // Strict lock: Sowa only provides 1 chosen hint!
    setUsedOwlHintId(hint.id);
    handleDiscoverClue(hint.revealedClueId);
  };

  // Solve case
  const handleSolveCase = () => {
    setIsNotebookOpen(false);
    setIsVictoryModalOpen(true);
  };

  // Proceed to next case
  const handleProceedNextCase = () => {
    if (caseIndex < ALL_CASES.length - 1) {
      setCaseIndex(caseIndex + 1);
      setDiscoveredClueIds([]);
      setUsedOwlHintId(undefined);
      setIsVictoryModalOpen(false);
    }
  };

  // Load case by 5-digit code
  const handleLoadCaseByCode = (code: string): boolean => {
    let foundIdx = ALL_CASES.findIndex((c) => c.caseCode === code);
    if (code === '55219') {
      foundIdx = ALL_CASES.length - 1; // Master Detective finale
    }
    if (foundIdx !== -1) {
      setCaseIndex(foundIdx);
      setDiscoveredClueIds([]);
      setUsedOwlHintId(undefined);
      setScreen('PLAYING');
      return true;
    }
    return false;
  };

  // Toggle mute
  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#1c0f06] font-['Outfit'] select-none">
      {screen === 'TITLE_SCREEN' ? (
        <TitleScreen
          onStartGame={() => setScreen('PLAYING')}
          onOpenCodeModal={() => setIsCodeModalOpen(true)}
          onOpenHelp={() => setIsHelpOpen(true)}
        />
      ) : (
        <div className="relative w-full h-full">
          {/* Main 2D Cross-Section Canvas */}
          <GameCanvas
            currentCase={currentCase}
            gameTime={gameTime}
            discoveredClueIds={discoveredClueIds}
            onInteractNPC={(npcId) => setDialogueState({ isOpen: true, npcId })}
            onInteractClue={(clue) => setDialogueState({ isOpen: true, clue })}
            onInteractBed={() => setIsSleepModalOpen(true)}
            heldKeys={heldKeys}
            onProximityChange={setProximityPrompt}
            actionTriggered={actionTriggered}
            onActionConsumed={() => setActionTriggered(false)}
          />

          {/* Minimalist HUD */}
          <HUD
            currentCase={currentCase}
            gameTime={gameTime}
            discoveredCount={discoveredClueIds.length}
            totalCluesCount={currentCase.clues.length}
            onOpenNotebook={() => setIsNotebookOpen(true)}
            onOpenSleep={() => setIsSleepModalOpen(true)}
            onOpenCodeModal={() => setIsCodeModalOpen(true)}
            onOpenHelp={() => setIsHelpOpen(true)}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
          />

          {/* Mobile Touch Controls */}
          <TouchControls
            onMoveLeftStart={() => setHeldKeys((k) => ({ ...k, ArrowLeft: true }))}
            onMoveLeftEnd={() => setHeldKeys((k) => ({ ...k, ArrowLeft: false }))}
            onMoveRightStart={() => setHeldKeys((k) => ({ ...k, ArrowRight: true }))}
            onMoveRightEnd={() => setHeldKeys((k) => ({ ...k, ArrowRight: false }))}
            onClimbUpStart={() => setHeldKeys((k) => ({ ...k, ArrowUp: true }))}
            onClimbUpEnd={() => setHeldKeys((k) => ({ ...k, ArrowUp: false }))}
            onClimbDownStart={() => setHeldKeys((k) => ({ ...k, ArrowDown: true }))}
            onClimbDownEnd={() => setHeldKeys((k) => ({ ...k, ArrowDown: false }))}
            onAction={() => setActionTriggered(true)}
            actionPrompt={proximityPrompt || undefined}
          />
        </div>
      )}

      {/* Modals */}
      <DialogueModal
        isOpen={dialogueState.isOpen}
        onClose={() => setDialogueState({ isOpen: false })}
        npcId={dialogueState.npcId}
        clue={dialogueState.clue}
        currentCase={currentCase}
        gameTime={gameTime}
        discoveredClueIds={discoveredClueIds}
        onDiscoverClue={handleDiscoverClue}
        onSelectOwlHint={handleSelectOwlHint}
        usedOwlHintId={usedOwlHintId}
      />

      <NotebookModal
        isOpen={isNotebookOpen}
        onClose={() => setIsNotebookOpen(false)}
        currentCase={currentCase}
        discoveredClueIds={discoveredClueIds}
        onSolveCase={handleSolveCase}
      />

      <SleepModal
        isOpen={isSleepModalOpen}
        onClose={() => setIsSleepModalOpen(false)}
        currentTime={gameTime}
        onSleep={handleSleep}
      />

      <CodeModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
        onLoadCaseByCode={handleLoadCaseByCode}
        currentCaseCode={currentCase.caseCode}
      />

      <CaseVictoryModal
        isOpen={isVictoryModalOpen}
        onClose={() => setIsVictoryModalOpen(false)}
        caseSolved={currentCase}
        onProceedNextCase={handleProceedNextCase}
        hasNextCase={caseIndex < ALL_CASES.length - 1}
      />

      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}
