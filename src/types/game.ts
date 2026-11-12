export type TimeOfDay = 'dawn' | 'day' | 'dusk' | 'night';

export interface GameTime {
  day: number;
  hour: number;
  minute: number;
}

export interface CharacterPortrait {
  id: string;
  name: string;
  species: 'kret' | 'sowa' | 'lis' | 'borsuk' | 'jez' | 'mysz' | 'slimak' | 'zaba';
  role: string;
  avatarColor: string;
}

export interface Clue {
  id: string;
  title: string;
  description: string;
  locationName: string;
  discoveredAt?: string;
  category: 'fizyczny' | 'zeznanie' | 'wiedzma_sowa' | 'plotka_ludzie';
  icon: string;
}

export interface Suspect {
  id: string;
  name: string;
  species: string;
  avatarColor: string;
  title: string;
  motive: string;
  alibi: string;
  isGuilty?: boolean;
}

export interface OwlHintOption {
  id: string;
  label: string;
  revealedClueId: string;
  hintText: string;
}

export interface CriminalCase {
  id: number;
  caseCode: string; // 5-digit level code to unlock this case
  nextCaseCode?: string; // Revealed when solved
  title: string;
  subtitle: string;
  storyIntro: string;
  culpritId: string;
  requiredEvidenceId: string;
  validEvidenceIds?: string[];
  victoryExplanation: string;
  suspects: Suspect[];
  clues: Clue[];
  owlHints: OwlHintOption[];
  tavernHumanGossip: string[];
}

export interface InteractiveObject {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'clue' | 'npc' | 'bed' | 'exit' | 'tavern_table';
  label: string;
  clueId?: string;
  npcId?: string;
  availableTime?: ('dawn' | 'day' | 'dusk' | 'night')[];
  icon?: string;
}

export interface WorldArea {
  id: string;
  name: string;
  layer: 'surface' | 'upper_burrows' | 'central_burrows' | 'deep_burrows';
  minY: number;
  maxY: number;
}
