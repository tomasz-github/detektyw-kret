import React from 'react';
import { sound } from '../utils/sound';
import { SPRITE_URLS } from '../utils/spriteAssets';
import { Sparkles, KeyRound, Play, BookOpen, Compass } from 'lucide-react';

interface TitleScreenProps {
  onStartGame: () => void;
  onOpenCodeModal: () => void;
  onOpenHelp: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStartGame,
  onOpenCodeModal,
  onOpenHelp,
}) => {
  return (
    <div className="relative w-full h-full min-h-screen flex flex-col items-center justify-between p-6 bg-gradient-to-b from-[#1e1b4b] via-[#381e0f] to-[#1c0f06] text-[#fef3c7] overflow-hidden select-none">
      {/* Background celestial stars and subtle soil silhouette */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="w-full h-full bg-[radial-gradient(#fde047_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      {/* Top Header Tag */}
      <div className="relative z-10 pt-4 flex items-center gap-2 text-xs uppercase tracking-widest text-[#f59e0b] font-semibold">
        <Sparkles className="w-4 h-4" />
        <span>Gra Detektywistyczna w Świecie Krecich Nor</span>
        <Sparkles className="w-4 h-4" />
      </div>

      {/* Centerpiece Hero Title & Storybook Bitmap Sprites */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl px-4 my-auto">
        <div className="relative flex items-center justify-center gap-3 mb-5">
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-3xl overflow-hidden border-4 border-[#f59e0b] shadow-[0_12px_30px_rgba(0,0,0,0.7)] transform hover:scale-105 transition-transform">
            <img
              src={SPRITE_URLS.kret}
              alt="Detektyw Kret"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-3 border-[#818cf8] shadow-[0_10px_24px_rgba(0,0,0,0.6)] rotate-6 hidden xs:block transform hover:rotate-0 transition-transform">
            <img
              src={SPRITE_URLS.sowa}
              alt="Czarodziejka Sowa"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        {/* Title Lockup */}
        <h1 className="text-4xl sm:text-6xl font-extrabold font-['Fredoka'] tracking-tight text-white drop-shadow-md">
          DETEKTYW KRET
        </h1>
        <p className="text-base sm:text-xl font-medium text-[#fde68a] mt-2 font-['Outfit']">
          Podziemne Śledztwa & Czarodziejka Nocy
        </p>

        {/* Story Intro Brief */}
        <p className="text-xs sm:text-sm text-[#fed7aa]/80 max-w-lg mt-3 leading-relaxed">
          Witaj w krainie podziemnych korytarzy! Wciel się w rolę sprytnego kreta-detektywa,
          odkrywaj wskazówki ukryte w norach i na powierzchni, odwiedzaj nocą Mądrą Sowę
          i rozwiązuj zagadki kryminalne bez użycia przemocy.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-8 w-full justify-center">
          <button
            onClick={() => {
              sound.playClick();
              onStartGame();
            }}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] hover:from-[#b45309] hover:to-[#d97706] text-white font-bold text-base shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>Rozpocznij Śledztwo</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenCodeModal();
            }}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#2d1a0e] hover:bg-[#452714] border-2 border-[#78350f] text-[#fef3c7] font-semibold text-sm shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <KeyRound className="w-4 h-4 text-[#facc15]" />
            <span>Wpisz 5-cyfrowy Kod</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenHelp();
            }}
            className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-[#2d1a0e]/60 hover:bg-[#452714] border border-[#78350f] text-[#fed7aa] font-medium text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Compass className="w-4 h-4 text-[#fbbf24]" />
            <span>Zasady</span>
          </button>
        </div>
      </div>

      {/* Control Hints Footer Line */}
      <div className="relative z-10 pb-2 text-center text-xs text-[#a8a29e] tracking-wide">
        <span className="hidden sm:inline">WASD / Strzałki: Ruch · W/S: Drabinki · Spacja / E: Badanie · N: Notatnik · Z: Sen</span>
        <span className="sm:hidden">Kliknij/dotknij na ekranie lub użyj wirtualnego kontrolera</span>
      </div>
    </div>
  );
};
