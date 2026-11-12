import React from 'react';
import { CriminalCase, GameTime } from '../types/game';
import { getTimeOfDay } from '../utils/renderWorld';
import { sound } from '../utils/sound';
import { BookOpen, Moon, Sun, Sunset, Bed, Volume2, VolumeX, KeyRound, HelpCircle } from 'lucide-react';

interface HUDProps {
  currentCase: CriminalCase;
  gameTime: GameTime;
  discoveredCount: number;
  totalCluesCount: number;
  onOpenNotebook: () => void;
  onOpenSleep: () => void;
  onOpenCodeModal: () => void;
  onOpenHelp: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  currentCase,
  gameTime,
  discoveredCount,
  totalCluesCount,
  onOpenNotebook,
  onOpenSleep,
  onOpenCodeModal,
  onOpenHelp,
  isMuted,
  onToggleMute,
}) => {
  const timeOfDay = getTimeOfDay(gameTime.hour);

  const getTimeIcon = () => {
    switch (timeOfDay) {
      case 'dawn':
        return <Sunset className="w-4 h-4 text-amber-400" />;
      case 'day':
        return <Sun className="w-4 h-4 text-yellow-400 animate-spin-slow" />;
      case 'dusk':
        return <Sunset className="w-4 h-4 text-orange-400" />;
      case 'night':
        return <Moon className="w-4 h-4 text-indigo-300" />;
    }
  };

  const getTimeLabel = () => {
    switch (timeOfDay) {
      case 'dawn':
        return 'Świt';
      case 'day':
        return 'Dzień';
      case 'dusk':
        return 'Zmierzch';
      case 'night':
        return 'Noc';
    }
  };

  return (
    <div className="fixed inset-x-0 top-0 z-40 pointer-events-none p-3 sm:p-4 flex flex-col justify-between">
      <div className="flex items-center justify-between gap-3 max-w-7xl mx-auto w-full">
        {/* Left: Empty space so Great Oak Tree & Owl at top-left are 100% clear and unoccluded */}
        <div className="hidden lg:block w-32 pointer-events-none" />

        {/* Center: Case Info & Clock Banner */}
        <div className="pointer-events-auto flex items-center gap-2 sm:gap-4 bg-[#1e1107]/90 backdrop-blur-md border border-[#78350f] px-3 py-2 sm:px-5 sm:py-2 rounded-2xl shadow-xl text-[#fef3c7] mx-auto">
          <div className="flex flex-col text-center sm:text-left">
            <span className="text-[10px] sm:text-xs uppercase tracking-wider text-[#f59e0b] font-bold truncate max-w-[170px] sm:max-w-xs">
              {currentCase.title}
            </span>
            <span className="text-[11px] sm:text-xs text-[#fed7aa]/80 hidden md:block">
              {currentCase.subtitle}
            </span>
          </div>

          <div className="h-6 w-px bg-[#78350f]" />

          {/* Time & Day */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#2d1a0e] border border-[#78350f]">
            {getTimeIcon()}
            <span className="text-xs font-mono font-bold tabular-nums text-white">
              {String(gameTime.hour).padStart(2, '0')}:{String(gameTime.minute).padStart(2, '0')}
            </span>
            <span className="text-[10px] text-[#fbbf24] font-medium hidden sm:inline">
              ({getTimeLabel()})
            </span>
          </div>
        </div>

        {/* Right: Action Buttons Cluster */}
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2">
          {/* Notebook button */}
          <button
            onClick={() => {
              sound.playPageTurn();
              onOpenNotebook();
            }}
            className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl bg-gradient-to-r from-[#d97706] to-[#b45309] hover:from-[#b45309] hover:to-[#92400e] text-white font-bold text-xs shadow-lg active:scale-95 transition-all"
            title="Otwórz Notatnik Detektywa [Klawisz N]"
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Notatnik</span>
            <span className="px-1.5 py-0.5 rounded-md bg-[#1c0f06] text-[#fde047] text-[10px] font-mono">
              {discoveredCount}/{totalCluesCount}
            </span>
          </button>

          {/* Sleep button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenSleep();
            }}
            className="flex items-center gap-1 px-2.5 py-2 sm:px-3 sm:py-2 rounded-2xl bg-[#2d1a0e]/90 hover:bg-[#452714] border border-[#78350f] text-[#fde68a] text-xs font-semibold shadow-md active:scale-95 transition-all"
            title="Idź spać / Zmień porę dnia [Klawisz Z]"
          >
            <Bed className="w-4 h-4 text-[#fbbf24]" />
            <span className="hidden sm:inline">Sen</span>
          </button>

          {/* Code modal button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenCodeModal();
            }}
            className="flex items-center gap-1 px-2.5 py-2 sm:px-3 sm:py-2 rounded-2xl bg-[#2d1a0e]/90 hover:bg-[#452714] border border-[#78350f] text-[#fef3c7] text-xs font-semibold shadow-md active:scale-95 transition-all"
            title="Wprowadź 5-cyfrowy kod etapu [Klawisz K]"
          >
            <KeyRound className="w-4 h-4 text-[#facc15]" />
            <span className="hidden sm:inline">Kod</span>
          </button>

          {/* Audio toggle */}
          <button
            onClick={onToggleMute}
            className="p-2 sm:p-2.5 rounded-2xl bg-[#2d1a0e]/90 hover:bg-[#452714] border border-[#78350f] text-[#fef3c7] shadow-md transition-all"
            title={isMuted ? 'Włącz dźwięki' : 'Wycisz dźwięki'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-green-400" />}
          </button>

          {/* Help button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenHelp();
            }}
            className="p-2 sm:p-2.5 rounded-2xl bg-[#2d1a0e]/90 hover:bg-[#452714] border border-[#78350f] text-[#fef3c7] shadow-md transition-all"
            title="Sterowanie i zasady gry"
          >
            <HelpCircle className="w-4 h-4 text-[#fbbf24]" />
          </button>
        </div>
      </div>
    </div>
  );
};
