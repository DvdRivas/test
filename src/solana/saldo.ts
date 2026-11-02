import { address } from "@solana/kit";
import { rpc } from "./conexion";

const LAMPORTS_POR_SOL = 1_000_000_000;

/*
Leer el saldo de una cuenta NO requiere firma, ni wallet conectada, ni ser dueno
de nada: la cadena es publica. Por eso esta funcion acepta cualquier direccion.

address() valida el formato y lanza si la direccion no es valida, asi que el error
de "me equivoque al pegar" sale aqui y no en la peticion a la red.
*/
export async function obtenerSaldo(direccion: string) {
  const { value } = await rpc.getBalance(address(direccion)).send();

  // value son lamports (bigint): la unidad minima de SOL
  return Number(value) / LAMPORTS_POR_SOL;
}
