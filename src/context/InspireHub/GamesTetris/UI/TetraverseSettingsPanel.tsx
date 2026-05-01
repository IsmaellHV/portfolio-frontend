import { PIECE_SETS, REALMS } from '../Domain/Engine/registry';
import { useTetraverseSettings } from '../Domain/Engine/SettingsContext';

export const TetraverseSettingsPanel = () => {
  const { settings, setRealm, setPieceSet, toggleShake, toggleParticles } = useTetraverseSettings();

  return (
    <div className="tetraverse-settings">
      <label className="ts-row">
        <span>Realm</span>
        <select value={settings.realmId} onChange={(e) => setRealm(e.target.value)}>
          {REALMS.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </label>

      <label className="ts-row">
        <span>Pieces</span>
        <select value={settings.pieceSetId} onChange={(e) => setPieceSet(e.target.value)}>
          {PIECE_SETS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </label>

      <label className="ts-row ts-toggle">
        <input type="checkbox" checked={settings.shakeEnabled} onChange={toggleShake} />
        <span>Screen shake</span>
      </label>

      <label className="ts-row ts-toggle">
        <input type="checkbox" checked={settings.particlesEnabled} onChange={toggleParticles} />
        <span>Particles / FX</span>
      </label>

      <p className="ts-hint">
        Cambiar piezas reinicia próximas spawns. Recarga partida si quieres reset total.
      </p>
    </div>
  );
};
