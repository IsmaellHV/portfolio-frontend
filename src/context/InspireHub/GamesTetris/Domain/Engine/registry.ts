import { PieceSet, Realm } from './types';
import { PieceSetClassic } from './PieceSets/Classic';
import { PieceSetMono } from './PieceSets/Mono';
import { PieceSetPento } from './PieceSets/Pento';
import { RealmClassic } from './Realms/Classic';
import { RealmBrick } from './Realms/Brick';
import { RealmVoid } from './Realms/Void';
import { RealmNeon3D } from './Realms/Neon3D';
import { RealmInferno } from './Realms/Inferno';

export const REALMS: Realm[] = [RealmClassic, RealmBrick, RealmNeon3D, RealmInferno, RealmVoid];
export const PIECE_SETS: PieceSet[] = [PieceSetClassic, PieceSetPento, PieceSetMono];

export const getRealm = (id: string): Realm => REALMS.find((r) => r.id === id) || RealmClassic;
export const getPieceSet = (id: string): PieceSet => PIECE_SETS.find((p) => p.id === id) || PieceSetClassic;
