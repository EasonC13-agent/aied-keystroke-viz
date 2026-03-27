export interface KsEntry {
  qid: string;
  keypresses: number;
  pastes: number;
  copies: number;
  order: string[];
  text: string;
}

export interface ParticipantData {
  id: string;
  rowIdx: number;
  duration: number;
  row: string[];
  ks: KsEntry[];
  flags: string[];
  flagDetails: Record<string, string[]>;
  isFlagged: boolean;
  verdict: "cheater" | "clean" | null;
  note: string;
}

export interface ParsedState {
  headers: string[];
  labelRow: string[];
  importRow: string[];
  dataRows: string[][];
  ksIdx: number;
  qidToCol: Record<string, string>;
  defaultIdCol: string;
  durIdx: number;
  idCol: string;
  DATA: ParticipantData[];
  qidList: string[];
  qLabels: Record<string, string>;
}
