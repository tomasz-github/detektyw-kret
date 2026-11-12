import React from 'react';
import { sound } from '../utils/sound';
import { HelpCircle, X, Moon, Bed, Search, KeyRound, Compass } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-[#27170c] border-2 border-[#b45309] rounded-3xl p-6 text-[#fef3c7] shadow-2xl">
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-1 rounded-lg text-[#fcd34d] hover:bg-[#78350f] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#78350f] border border-[#d97706] flex items-center justify-center text-[#facc15]">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-['Fredoka'] text-white">Poradnik Detektywa</h3>
            <span className="text-xs text-[#fbbf24]">Zasady i wskazówki dla śledczego</span>
          </div>
        </div>

        <div className="space-y-3 text-xs leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
          <div className="p-3 rounded-xl bg-[#1c1109] border border-[#78350f]">
            <h4 className="font-bold text-[#f59e0b] text-sm font-['Fredoka'] flex items-center gap-1.5 mb-1">
              🎮 Sterowanie
            </h4>
            <ul className="space-y-1 text-[#fed7aa]">
              <li>• <strong>Klawiatura:</strong> [A] [D] lub Strzałki lewo/prawo do chodzenia. [W] [S] lub góra/dół do wspinaczki po drabinach i korzeniach. [Spacja] lub [E] do badania obiektów i rozmowy.</li>
              <li>• <strong>Mysz:</strong> Kliknij w dowolne miejsce, aby Kret tam poszedł. Kliknij na postać lub wskazówkę, by do niej podejść.</li>
              <li>• <strong>Telefon / Tablet:</strong> Wygodne przyciski kierunkowe i duży przycisk lupy na dole ekranu.</li>
            </ul>
          </div>

          <div className="p-3 rounded-xl bg-[#1c1109] border border-[#78350f]">
            <h4 className="font-bold text-[#f59e0b] text-sm font-['Fredoka'] flex items-center gap-1.5 mb-1">
              <Moon className="w-4 h-4 text-[#818cf8]" /> Pory Dnia & Czarodziejka Sowa
            </h4>
            <p className="text-[#fed7aa]">
              Czas płynie naturalnie, ale możesz też pójść spać do swojego <strong>łóżka z mchu</strong> w norce Kreta. 
              <strong>Mądra Sowa na dębie czuwa tylko nocą (po 20:00)!</strong> W dzień ucina sobie drzemkę. 
              W nocy zawsze zaproponuje Ci 2 lub 3 magiczne podpowiedzi do wyboru!
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#1c1109] border border-[#78350f]">
            <h4 className="font-bold text-[#f59e0b] text-sm font-['Fredoka'] flex items-center gap-1.5 mb-1">
              <Search className="w-4 h-4 text-[#fbbf24]" /> Notatnik i Rozwiązywanie Zagadek
            </h4>
            <p className="text-[#fed7aa]">
              Wciskając [N] lub ikonę książki otwierasz Notatnik. W zakładce <strong>Tablica Dedukcji</strong> wybierasz oskarżonego i kluczowy dowód. 
              Nie ma limitu prób ani ryzyka przegranej – to przytulna gra dedukcyjna!
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#1c1109] border border-[#78350f]">
            <h4 className="font-bold text-[#f59e0b] text-sm font-['Fredoka'] flex items-center gap-1.5 mb-1">
              <KeyRound className="w-4 h-4 text-[#facc15]" /> Kody 5-cyfrowe
            </h4>
            <p className="text-[#fed7aa]">
              Każda rozwiązana sprawa odkrywa 5-cyfrowy kod. Zapisz go! Po powrocie do gry wystarczy wpisać kod w menu głównym, by od razu przejść do kolejnej sprawy.
            </p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#78350f] flex justify-end">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-white text-xs font-bold"
          >
            Wszystko jasne, gramy!
          </button>
        </div>
      </div>
    </div>
  );
};
