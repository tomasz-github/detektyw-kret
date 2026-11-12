import React from 'react';
import { GameTime } from '../types/game';
import { getTimeOfDay } from '../utils/renderWorld';
import { sound } from '../utils/sound';
import { Moon, Sun, Clock, X, Bed } from 'lucide-react';

interface SleepModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTime: GameTime;
  onSleep: (hoursToAdd: number) => void;
}

export const SleepModal: React.FC<SleepModalProps> = ({
  isOpen,
  onClose,
  currentTime,
  onSleep,
}) => {
  if (!isOpen) return null;

  const currentHour = currentTime.hour;

  // Calculate hours until 21:00 (Night/Owl wake-up)
  let hoursUntilNight = 21 - currentHour;
  if (hoursUntilNight <= 0) hoursUntilNight += 24;

  // Calculate hours until 06:00 (Dawn/Morning)
  let hoursUntilDawn = 6 - currentHour;
  if (hoursUntilDawn <= 0) hoursUntilDawn += 24;

  const handleSelectSleep = (hours: number) => {
    sound.playSleepLullaby();
    onSleep(hours);
    onClose();
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
          <div className="w-14 h-14 rounded-2xl bg-[#78350f] border-2 border-[#d97706] flex items-center justify-center text-3xl shadow-inner text-[#fde68a]">
            <Bed className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-['Fredoka'] text-white">Łóżko z Mechowej Pierzynki</h3>
            <div className="text-xs text-[#fbbf24] flex items-center gap-1.5 mt-0.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Aktualna godzina: {String(currentTime.hour).padStart(2, '0')}:{String(currentTime.minute).padStart(2, '0')}</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-[#fde68a]/90 leading-relaxed bg-[#1c1109] p-3 rounded-xl border border-[#78350f] mb-5">
          Odpocznij, aby przyspieszyć upływ czasu i zmienić porę dnia. Pamiętaj: Czarodziejka Sowa budzi się dopiero o zmroku (po 20:00)!
        </p>

        <div className="space-y-2.5">
          <button
            onClick={() => handleSelectSleep(2)}
            className="w-full p-3.5 rounded-xl bg-[#1c1109] border border-[#78350f] hover:border-[#f59e0b] hover:bg-[#382011] transition-all flex items-center justify-between group"
          >
            <div className="text-left">
              <span className="font-bold text-sm font-['Fredoka'] text-white group-hover:text-[#fde68a]">
                Krótka drzemka (2 godziny)
              </span>
              <p className="text-[11px] text-[#a8a29e]">Szybka regeneracja przed dalszym dochodzeniem</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#78350f] text-[#fef3c7]">
              +2h
            </span>
          </button>

          <button
            onClick={() => handleSelectSleep(hoursUntilNight)}
            className="w-full p-3.5 rounded-xl bg-[#1e1b4b]/60 border border-[#6366f1] hover:bg-[#312e81] transition-all flex items-center justify-between group"
          >
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <Moon className="w-4 h-4 text-[#818cf8]" />
                <span className="font-bold text-sm font-['Fredoka'] text-white group-hover:text-[#c7d2fe]">
                  Śpij do zmroku (godz. 21:00)
                </span>
              </div>
              <p className="text-[11px] text-[#a5b4fc]">Obudź się w nocy, gdy czuwa Czarodziejka Sowa</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#4338ca] text-[#e0e7ff]">
              +{hoursUntilNight}h
            </span>
          </button>

          <button
            onClick={() => handleSelectSleep(hoursUntilDawn)}
            className="w-full p-3.5 rounded-xl bg-[#422006]/60 border border-[#f59e0b] hover:bg-[#78350f] transition-all flex items-center justify-between group"
          >
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-[#fbbf24]" />
                <span className="font-bold text-sm font-['Fredoka'] text-white group-hover:text-[#fde68a]">
                  Śpij do poranka (godz. 06:00)
                </span>
              </div>
              <p className="text-[11px] text-[#fed7aa]">Obudź się o świcie na słonecznej powierzchni</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#92400e] text-[#fef3c7]">
              +{hoursUntilDawn}h
            </span>
          </button>

          <button
            onClick={() => handleSelectSleep(8)}
            className="w-full p-3.5 rounded-xl bg-[#1c1109] border border-[#78350f] hover:border-[#f59e0b] hover:bg-[#382011] transition-all flex items-center justify-between group"
          >
            <div className="text-left">
              <span className="font-bold text-sm font-['Fredoka'] text-white group-hover:text-[#fde68a]">
                Pełen odpoczynek (8 godzin)
              </span>
              <p className="text-[11px] text-[#a8a29e]">Długi, głęboki sen w miękkim posłaniu</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#78350f] text-[#fef3c7]">
              +8h
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
