import React from 'react';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Search } from 'lucide-react';

interface TouchControlsProps {
  onMoveLeftStart: () => void;
  onMoveLeftEnd: () => void;
  onMoveRightStart: () => void;
  onMoveRightEnd: () => void;
  onClimbUpStart: () => void;
  onClimbUpEnd: () => void;
  onClimbDownStart: () => void;
  onClimbDownEnd: () => void;
  onAction: () => void;
  actionPrompt?: string;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  onMoveLeftStart,
  onMoveLeftEnd,
  onMoveRightStart,
  onMoveRightEnd,
  onClimbUpStart,
  onClimbUpEnd,
  onClimbDownStart,
  onClimbDownEnd,
  onAction,
  actionPrompt,
}) => {
  return (
    <div className="fixed inset-x-0 bottom-3 z-40 pointer-events-none flex justify-between items-end px-4 sm:hidden">
      {/* Virtual D-Pad for mobile */}
      <div className="pointer-events-auto grid grid-cols-3 grid-rows-3 gap-1 w-36 h-36 bg-[#1a0f07]/80 backdrop-blur-md p-1.5 rounded-full border border-[#78350f] shadow-2xl">
        <div />
        <button
          onTouchStart={onClimbUpStart}
          onTouchEnd={onClimbUpEnd}
          onMouseDown={onClimbUpStart}
          onMouseUp={onClimbUpEnd}
          className="flex items-center justify-center rounded-xl bg-[#2d1a0e] text-[#fde68a] active:bg-[#d97706] active:text-white"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
        <div />

        <button
          onTouchStart={onMoveLeftStart}
          onTouchEnd={onMoveLeftEnd}
          onMouseDown={onMoveLeftStart}
          onMouseUp={onMoveLeftEnd}
          className="flex items-center justify-center rounded-xl bg-[#2d1a0e] text-[#fde68a] active:bg-[#d97706] active:text-white"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center justify-center text-[10px] text-[#78350f] font-bold">
          RUCH
        </div>
        <button
          onTouchStart={onMoveRightStart}
          onTouchEnd={onMoveRightEnd}
          onMouseDown={onMoveRightStart}
          onMouseUp={onMoveRightEnd}
          className="flex items-center justify-center rounded-xl bg-[#2d1a0e] text-[#fde68a] active:bg-[#d97706] active:text-white"
        >
          <ArrowRight className="w-6 h-6" />
        </button>

        <div />
        <button
          onTouchStart={onClimbDownStart}
          onTouchEnd={onClimbDownEnd}
          onMouseDown={onClimbDownStart}
          onMouseUp={onClimbDownEnd}
          className="flex items-center justify-center rounded-xl bg-[#2d1a0e] text-[#fde68a] active:bg-[#d97706] active:text-white"
        >
          <ArrowDown className="w-6 h-6" />
        </button>
        <div />
      </div>

      {/* Action / Inspect Button */}
      <div className="pointer-events-auto flex flex-col items-center">
        {actionPrompt && (
          <span className="text-[10px] font-bold px-2 py-0.5 mb-1.5 rounded-md bg-[#d97706] text-white shadow-md animate-bounce">
            {actionPrompt}
          </span>
        )}
        <button
          onClick={onAction}
          className="w-18 h-18 rounded-full bg-gradient-to-tr from-[#b45309] to-[#fbbf24] p-1 shadow-2xl active:scale-95 transition-transform flex items-center justify-center"
        >
          <div className="w-full h-full rounded-full bg-[#1c0f06] flex flex-col items-center justify-center text-[#fef08a]">
            <Search className="w-7 h-7" />
            <span className="text-[9px] font-bold uppercase mt-0.5">Zbadaj</span>
          </div>
        </button>
      </div>
    </div>
  );
};
