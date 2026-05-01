// Plugin contracts for Tetraverse engine.
// PieceId 0 = empty. 1..N = filled with piece type id.

export type PieceId = number;
export type Cell = PieceId;
export type Grid = Cell[][];
export type Shape = number[][];

export interface PieceShape {
  id: PieceId;
  key: string; // "I", "O", ...
  matrix: Shape; // base orientation
}

export interface PieceSet {
  id: string;
  name: string;
  pieces: PieceShape[];
  // Optional spawn weights, same length as pieces; defaults to uniform
  spawnWeights?: number[];
}

export type EffectKind = 'shatter' | 'burn' | 'dissolve' | 'pop' | 'glitch' | 'implode' | 'shake' | 'flash';

export interface Effect {
  kind: EffectKind;
  rows?: number[];
  pieceId?: PieceId;
  durationMs?: number;
  intensity?: number;
}

export interface RealmCellRender {
  pieceId: PieceId;
  isClearing: boolean;
  rowIndex: number;
  colIndex: number;
}

export interface Realm {
  id: string;
  name: string;
  // Class applied to <board> wrapper, drives palette + textures + scanlines
  rootClass: string;
  // Class per cell, may use pieceId/clearing flags
  cellClass?: (ctx: RealmCellRender) => string;
  // CSS color per piece (fallback)
  palette: Record<PieceId, string>;
  // Effect pipeline triggered on line clear, used by FX layer
  onLineClear?: (rows: number[]) => Effect[];
  // Optional ambient overlay component class
  overlayClass?: string;
}
