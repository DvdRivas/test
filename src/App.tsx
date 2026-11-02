import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

import { ENDPOINT } from "./solana/conexion";
import { obtenerSaldo } from "./solana/saldo";

export default function App() {
  return (
    <main>
      <header>
        <div>
          <h1>Conexión con Solana</h1>
          <small>{ENDPOINT}</small>
        </div>
        <WalletMultiButton />
      </header>

      <MiSaldo />
      <SaldoDeCualquiera />
    </main>
  );
}

/* --------------------------------------------------------------------------
   Panel 1: la wallet conectada

   useWallet() es el hook del adapter. publicKey es null mientras nadie conecta,
   y cambia en cuanto el usuario elige wallet y acepta: de ahi el useEffect.
   -------------------------------------------------------------------------- */
function MiSaldo() {
  const { publicKey } = useWallet();
  const [saldo, setSaldo] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!publicKey) {
      setSaldo(null);
      return;
    }

    setError("");
    obtenerSaldo(publicKey.toBase58())
      .then(setSaldo)
      .catch((e) => setError(String(e)));
  }, [publicKey]);

  return (
    <section>
      <h2>Tu wallet</h2>

      {!publicKey ? (
        <p className="vacio">
          Nadie conectado. Usa el botón de arriba: ahí aparecen las wallets que
          tengas instaladas en este navegador.
        </p>
      ) : (
        <>
          <p className="dato">
            <span>Dirección</span>
            <code>{publicKey.toBase58()}</code>
          </p>
          <p className="dato">
            <span>Saldo</span>
            <code>{saldo === null ? "..." : `${saldo} SOL`}</code>
          </p>
        </>
      )}

      {error && <p className="error">{error}</p>}
    </section>
  );
}

/* --------------------------------------------------------------------------
   Panel 2: cualquier direccion

   Este panel funciona SIN conectar nada. Es el punto del dia: leer la cadena no
   necesita firma ni permiso, y el programa que desplegaste el martes puede ser
   usado por cualquier wallet, no solo por la tuya.
   -------------------------------------------------------------------------- */
function SaldoDeCualquiera() {
  const [direccion, setDireccion] = useState("");
  const [saldo, setSaldo] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function consultar() {
    setCargando(true);
    setError("");
    setSaldo(null);

    try {
      setSaldo(await obtenerSaldo(direccion.trim()));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setCargando(false);
    }
  }

  return (
    <section>
      <h2>Cualquier dirección</h2>
      <p className="nota">
        No hace falta conectar wallet: la cadena es pública. Pega la dirección de
        un compañero y consulta su saldo.
      </p>

      <div className="fila">
        <input
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          placeholder="Dirección en base58"
        />
        <button onClick={consultar} disabled={cargando || !direccion.trim()}>
          {cargando ? "Consultando..." : "Consultar"}
        </button>
      </div>

      {saldo !== null && (
        <p className="dato">
          <span>Saldo</span>
          <code>{saldo} SOL</code>
        </p>
      )}

      {error && <p className="error">{error}</p>}
    </section>
  );
}
