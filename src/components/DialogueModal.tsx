import React from 'react';
import { Clue, CriminalCase, GameTime, OwlHintOption } from '../types/game';
import { getTimeOfDay } from '../utils/renderWorld';
import { sound } from '../utils/sound';
import { SPRITE_URLS } from '../utils/spriteAssets';
import { Sparkles, Moon, Sun, Search, X, Check, Coffee } from 'lucide-react';

interface DialogueModalProps {
  isOpen: boolean;
  onClose: () => void;
  npcId?: string;
  clue?: Clue;
  currentCase: CriminalCase;
  gameTime: GameTime;
  discoveredClueIds: string[];
  onDiscoverClue: (clueId: string) => void;
  onSelectOwlHint: (hint: OwlHintOption) => void;
  usedOwlHintId?: string;
}

export const DialogueModal: React.FC<DialogueModalProps> = ({
  isOpen,
  onClose,
  npcId,
  clue,
  currentCase,
  gameTime,
  discoveredClueIds,
  onDiscoverClue,
  onSelectOwlHint,
  usedOwlHintId,
}) => {
  if (!isOpen) return null;

  const timeOfDay = getTimeOfDay(gameTime.hour);

  // If inspecting a physical clue
  if (clue) {
    const isAlreadyKnown = discoveredClueIds.includes(clue.id);

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
        <div className="relative w-full max-w-lg bg-[#27170c] border-2 border-[#b45309] rounded-2xl p-6 text-[#fef3c7] shadow-2xl">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 p-1 rounded-lg text-[#fcd34d] hover:bg-[#78350f] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-[#78350f] border border-[#d97706] flex items-center justify-center shrink-0 text-[#facc15] shadow-inner">
              <Search className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-[#fbbf24] font-semibold">
                Odkrycie Detektywistyczne · {clue.locationName}
              </span>
              <h3 className="text-xl font-bold font-['Fredoka'] text-white mt-0.5">{clue.title}</h3>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-[#fde68a] bg-[#1c1109] p-4 rounded-xl border border-[#92400e] mb-6">
            "{clue.description}"
          </p>

          <div className="flex items-center justify-between">
            <span className="text-xs text-[#d97706]">
              {isAlreadyKnown ? '✓ Wskazówka zapisana w Notatniku' : '★ Nowy dowód dodany do śledztwa!'}
            </span>
            <button
              onClick={() => {
                if (!isAlreadyKnown) {
                  sound.playClueFound();
                  onDiscoverClue(clue.id);
                } else {
                  sound.playClick();
                }
                onClose();
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#b45309] hover:from-[#b45309] hover:to-[#92400e] text-white font-medium text-sm transition-all shadow-md active:scale-95 flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Zapisz w Notatniku
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If talking to Sowa Czarodziejka
  if (npcId === 'npc_sowa') {
    const isSleeping = timeOfDay === 'day' || timeOfDay === 'dawn';

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
        <div className="relative w-full max-w-xl bg-[#1e1b4b] border-2 border-[#818cf8] rounded-2xl p-6 text-[#e0e7ff] shadow-2xl">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 p-1 rounded-lg text-[#c7d2fe] hover:bg-[#312e81] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4 mb-4">
            <img
              src={SPRITE_URLS.sowa}
              alt="Czarodziejka Sowa"
              className="w-18 h-18 rounded-2xl object-cover border-2 border-[#a5b4fc] shadow-lg shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold font-['Fredoka'] text-white">Czarodziejka Sowa Aurelia</h3>
                <span className="px-2 py-0.5 rounded-full text-xs bg-[#4338ca] text-[#c7d2fe] flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Wyrocznia Nocy
                </span>
              </div>
              <span className="text-xs text-[#a5b4fc]">
                {isSleeping ? 'Śpi w ciągu dnia (odwiedź ją w nocy po 20:00)' : 'Czuwa pod gwieździstym niebem'}
              </span>
            </div>
          </div>

          {isSleeping ? (
            <div className="bg-[#0f172a] p-5 rounded-xl border border-[#3730a3] text-center my-4 space-y-3">
              <div className="flex justify-center text-amber-300">
                <Sun className="w-8 h-8 animate-spin-slow opacity-80" />
              </div>
              <p className="text-base italic text-[#c7d2fe]">
                "Chrrr-fiuuu... Zzz... Czarodziejka śpi w dzień i nabiera magicznych sił. Nie budź jej, póki słońce stoi na niebie!"
              </p>
              <p className="text-xs text-[#94a3b8]">
                💡 Wskazówka: Wróć do swojej norki, połóż się do łóżka z mchu i prześpij czas do nocy (godz. 21:00).
              </p>
            </div>
          ) : usedOwlHintId ? (
            // Sowa already gave her 1 chosen hint for this case!
            (() => {
              const chosenHint = currentCase.owlHints.find((h) => h.id === usedOwlHintId) || currentCase.owlHints[0];
              return (
                <div className="space-y-4 my-2">
                  <div className="bg-[#312e81]/60 p-4 rounded-xl border border-[#4f46e5]">
                    <p className="text-sm leading-relaxed text-[#e0e7ff] italic">
                      "Moja nocna magia na to śledztwo została skupiona na Twoim pytaniu. Oto jedyna odpowiedź, jakiej mogłam Ci udzielić:"
                    </p>
                  </div>

                  {/* The Single Chosen Hint Card */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-[#4338ca] to-[#312e81] border-2 border-[#facc15] shadow-xl text-white">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#fef08a] uppercase tracking-wider mb-2">
                      <Sparkles className="w-4 h-4 text-[#facc15]" />
                      <span>Wybrana Przepowiednia: {chosenHint.label}</span>
                    </div>
                    <p className="text-sm font-semibold leading-relaxed text-[#fef9c3] bg-[#1e1b4b]/80 p-3.5 rounded-xl border border-[#6366f1]">
                      "{chosenHint.hintText}"
                    </p>
                    <div className="mt-3 flex items-center justify-between text-xs text-[#c7d2fe]">
                      <span>✓ Wskazówka została zapisana w Notatniku</span>
                      <span className="font-mono text-[11px] bg-[#312e81] px-2 py-0.5 rounded font-bold text-[#fde047]">
                        1/1 Wykorzystano
                      </span>
                    </div>
                  </div>

                  {/* Locked notice for other hints */}
                  <div className="p-3.5 rounded-xl bg-[#0f172a]/80 border border-[#3730a3] text-xs text-[#94a3b8] flex items-start gap-2.5">
                    <span className="text-base shrink-0">🔒</span>
                    <div>
                      <p className="font-semibold text-[#cbd5e1]">Magia Sowy na tę sprawę została wyczerpana.</p>
                      <p className="text-[11px] text-[#94a3b8] mt-0.5">
                        Czarodziejka może wyjawić tylko jeden sekret. Pozostałe poszlaki musisz odnaleźć i połączyć własną dedukcją w podziemnych norach!
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()
          ) : (
            // Player has not chosen a hint yet: present the 2-3 options, pick ONE
            <div className="space-y-4 my-2">
              <div className="bg-[#312e81]/60 p-4 rounded-xl border border-[#4f46e5]">
                <p className="text-sm leading-relaxed text-[#e0e7ff] italic">
                  "Witaj, cichy wędrowcze krecich korytarzy. Mogę skupić mą magię i ofiarować Ci <strong>tylko jedną wybraną podpowiedź</strong> w tym śledztwie. Wybierz rozważnie, o co pragniesz zapytać:"
                </p>
              </div>

              <div className="space-y-2.5">
                <label className="text-xs font-semibold text-[#facc15] uppercase tracking-wide flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Wybierz dokładnie jedną podpowiedź (pozostałe przepadną):
                </label>
                {currentCase.owlHints.map((hint, idx) => (
                  <button
                    key={hint.id}
                    onClick={() => {
                      sound.playOwlMagic();
                      onSelectOwlHint(hint);
                    }}
                    className="w-full text-left p-3.5 rounded-xl border bg-[#1e1b4b] border-[#4338ca] hover:bg-[#3730a3] hover:border-[#818cf8] text-[#e0e7ff] transition-all flex items-center justify-between group active:scale-98 shadow-sm cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-[#312e81] text-xs font-bold flex items-center justify-center shrink-0 text-[#fde047] group-hover:bg-[#4338ca]">
                        {idx + 1}
                      </span>
                      <span className="text-sm font-semibold group-hover:text-white">
                        {hint.label}
                      </span>
                    </div>
                    <span className="text-[11px] px-2.5 py-1 rounded-md bg-[#312e81] text-[#c7d2fe] group-hover:bg-[#4f46e5] group-hover:text-white shrink-0">
                      Wybierz tę wizję →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="px-5 py-2 rounded-xl bg-[#4338ca] hover:bg-[#3730a3] text-white text-sm font-medium transition-colors"
            >
              Zamknij
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If talking to Tavern Bartender Zenon or patrons
  if (npcId === 'npc_zenon') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
        <div className="relative w-full max-w-lg bg-[#2b180d] border-2 border-[#b45309] rounded-2xl p-6 text-[#fef3c7] shadow-2xl">
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
            <div className="w-16 h-16 rounded-2xl bg-[#78350f] border-2 border-[#d97706] flex items-center justify-center text-3xl shadow-inner">
              🐌
            </div>
            <div>
              <h3 className="text-xl font-bold font-['Fredoka'] text-white">Ślimak Zenon (Gospodarz)</h3>
              <span className="text-xs text-[#fbbf24]">Tawerna "Pod Wilgotnym Korzeniem"</span>
            </div>
          </div>

          <div className="bg-[#1c1109] p-4 rounded-xl border border-[#92400e] text-sm text-[#fde68a] space-y-3 mb-4">
            <p className="italic">
              "Witaj, Detektywie Krecie! Podgrzać kubek nektaru z mniszka? W tawernie aż huczy od plotek o świecie ludzi i o naszym dochodzeniu!"
            </p>
            <div className="border-t border-[#78350f] pt-3">
              <span className="text-xs uppercase font-semibold text-[#f59e0b] flex items-center gap-1 mb-1">
                <Coffee className="w-3.5 h-3.5" /> Wieści ze świata ludzi:
              </span>
              <ul className="text-xs space-y-1.5 text-[#fef3c7]">
                {currentCase.tavernHumanGossip.map((gossip, i) => (
                  <li key={i} className="pl-2 border-l-2 border-[#d97706]">
                    {gossip}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs text-[#d97706]">W Tawernie dowiesz się najwięcej o alibi podejrzanych.</span>
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-white text-sm font-medium"
            >
              Dziękuję, Zenonie!
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Talking to Lis Felix
  if (npcId === 'npc_lis') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
        <div className="relative w-full max-w-lg bg-[#27170c] border-2 border-[#ea580c] rounded-2xl p-6 text-[#fed7aa] shadow-2xl">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 p-1 rounded-lg text-[#fed7aa] hover:bg-[#7c2d12] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4 mb-4">
            <img
              src={SPRITE_URLS.lis}
              alt="Lis Felix"
              className="w-18 h-18 rounded-2xl object-cover border-2 border-[#ea580c] shadow-lg shrink-0"
            />
            <div>
              <h3 className="text-xl font-bold font-['Fredoka'] text-white">Lis Felix</h3>
              <span className="text-xs text-[#fdba74]">Rudy spryciarz z zarośli</span>
            </div>
          </div>

          <div className="bg-[#1c1109] p-4 rounded-xl border border-[#9a3412] text-sm text-[#ffedd5] space-y-2 mb-4">
            <p className="italic">
              "Och, to pan, panie szanowny Detektywie! Szuka pan winnych? Ja? Ja jestem niewinny jak leśna stokrotka! Całą noc spędziłem po drugiej stronie rzeki, wąchając fiołki... No, może raz zajrzałem pod płot ludzi, ale to tylko z czystej ciekawości!"
            </p>
            <p className="text-xs text-[#ea580c] font-semibold">
              ⚠️ Uwaga: Lis mówi z podejrzanym uśmieszkiem i co chwilę zerka na swój ogon.
            </p>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-sm font-medium"
            >
              Będę cię obserwował, Felixie...
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Talking to Borsuk Barnaba
  if (npcId === 'npc_borsuk') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
        <div className="relative w-full max-w-lg bg-[#1e293b] border-2 border-[#64748b] rounded-2xl p-6 text-[#e2e8f0] shadow-2xl">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 p-1 rounded-lg text-[#94a3b8] hover:bg-[#334155] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4 mb-4">
            <img
              src={SPRITE_URLS.borsuk}
              alt="Borsuk Barnaba"
              className="w-18 h-18 rounded-2xl object-cover border-2 border-[#94a3b8] shadow-lg shrink-0"
            />
            <div>
              <h3 className="text-xl font-bold font-['Fredoka'] text-white">Borsuk Barnaba</h3>
              <span className="text-xs text-[#94a3b8]">Główny Strażnik Korytarzy</span>
            </div>
          </div>

          <div className="bg-[#0f172a] p-4 rounded-xl border border-[#475569] text-sm text-[#cbd5e1] space-y-2 mb-4">
            <p className="italic">
              "Hrrrumph! W podziemiach ma panować porządek i dyscyplina! Sprawdziłem zasuwy i stemple drewniane. Żaden krecik nie powinien biegać po nocy po powierzchni! Jeśli szukasz dowodów, Krecie, zbadaj dokładnie podłogę spiżarni i stare przejścia."
            </p>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-[#475569] hover:bg-[#334155] text-white text-sm font-medium"
            >
              Rozumiem, Barnabo.
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Talking to Jeż Igiełka
  if (npcId === 'npc_jez') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
        <div className="relative w-full max-w-lg bg-[#292524] border-2 border-[#78716c] rounded-2xl p-6 text-[#f5f5f4] shadow-2xl">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 p-1 rounded-lg text-[#a8a29e] hover:bg-[#44403c] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4 mb-4">
            <img
              src={SPRITE_URLS.jez}
              alt="Jeż Igiełka"
              className="w-18 h-18 rounded-2xl object-cover border-2 border-[#a8a29e] shadow-lg shrink-0"
            />
            <div>
              <h3 className="text-xl font-bold font-['Fredoka'] text-white">Jeż Igiełka</h3>
              <span className="text-xs text-[#d6d3d1]">Cichy leśny ogrodnik</span>
            </div>
          </div>

          <div className="bg-[#1c1917] p-4 rounded-xl border border-[#57534e] text-sm text-[#e7e5e4] space-y-2 mb-4">
            <p className="italic">
              "P-panie Detektywie... n-niech pan na mnie tak groźnie nie patrzy przez lupę! Ja tylko zbieram spadające jabłka i suche liście. Nocą wolę spać w mojej norkowej sypialni, bo za dnia człowiek w ogrodzie hałasuje dziwną kosiarką!"
            </p>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-[#78716c] hover:bg-[#57534e] text-white text-sm font-medium"
            >
              Spokojnie, Igiełko.
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
