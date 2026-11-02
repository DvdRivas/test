# Taller de Frontend — Conexión con Solana

Punto de partida del **día 3** del Advanced Bootcamp. La conexión ya está hecha:
la sesión es para entender cómo funciona y dejar listo el cliente del programa
que desplegaste el martes.

La app arranca sin IDL y sin programa. Lo único que hace al principio es
conectar una wallet y leer saldos, que es la forma más corta de comprobar que el
navegador está hablando con la cadena.

---

## 1. Abrir el proyecto

Dale **Fork** a este repositorio para trabajar sobre tu propia copia.

**Desde Codespaces** (recomendado, no instalas nada): botón `<> Code` →
pestaña `Codespaces` → `Create codespace on main`. El contenedor instala Node y
las dependencias solo; espera a que termine.

**En tu máquina**: clona el repo y ábrelo en VS Code con la extensión *Dev
Containers*; te va a ofrecer reabrirlo en el contenedor. Si prefieres sin
contenedor, necesitas Node 20 o superior y corres `npm install`.

Ya listo:

```bash
npm run dev
```

> ⚠️ **Abre la app en una pestaña real del navegador**, no en el visor que VS
> Code ofrece dentro del editor. Las extensiones de wallet no existen ahí
> dentro, y el botón de conectar no va a encontrar ninguna.
>
> En Codespaces: pestaña `Ports` → el puerto 5173 → icono del globo.

---

## 2. Primera parte: la wallet y los saldos

### Instala una wallet

Cualquiera que soporte Wallet Standard: **Phantom**, **Solflare** o
**Backpack**. La app no nombra ninguna — detecta las que tengas instaladas.

Cámbiala a **Devnet** en su configuración. Si la dejas en mainnet no vas a ver
nada de lo que hiciste esta semana.

### Usa la misma llave que en Playground

El miércoles solo lees saldos, pero mañana vas a operar tu registro — y tu
registro es de la wallet que lo creó. Para que mañana todo esté en su lugar,
importa a tu wallet el keypair que usaste en Solana Playground en vez de crear
una nueva.

> 🔑 Esa llave es de devnet y es desechable. Nunca importes ni exportes así una
> wallet con fondos reales.

### Qué deberías ver

- **Tu wallet**: conectas y aparecen tu dirección y tu saldo.
- **Cualquier dirección**: pegas la dirección de un compañero y ves su saldo,
  sin conectar nada. Leer la cadena no requiere firma ni permiso.

---

## 3. Segunda parte: generar el cliente con Codama

Tu programa expone un **IDL**: la descripción de sus instrucciones, sus cuentas
y sus errores. Codama lo lee y escribe, en TypeScript, las funciones para
hablar con él.

1. En Solana Playground, haz `build` y `deploy` si no lo has hecho.
2. Descarga el IDL y guárdalo en la raíz de este proyecto como **`idl.json`**.
3. Ábrelo y confirma que trae la dirección de **tu** programa. Si no aparece,
   agrégala:

   ```json
   "metadata": { "address": "TU_PROGRAM_ID" }
   ```

4. Genera el cliente:

   ```bash
   npm run cliente
   ```

Aparece la carpeta `clients/js`. Ábrela: ahí están tus cinco instrucciones
(`getCrearRegistroInstruction`, `getRegistrarVentaInstruction`...), tus tres
cuentas y tus códigos de error. Es el mismo programa que escribiste en Rust,
traducido a TypeScript.

De momento nada de la app lo usa. **Eso es mañana.**

---

## Qué hay en el proyecto

```
src/
  polyfills.ts        Buffer para el navegador. Va importado primero, a proposito
  main.tsx            los providers del wallet adapter
  App.tsx             los dos paneles de saldo
  solana/
    conexion.ts       el endpoint y el rpc de lectura, en un solo lugar
    saldo.ts          leer el saldo de cualquier direccion
codama.json           configuracion del generador
```

Dos SDK de Solana conviven aquí, y cada uno tiene su trabajo: **`@solana/kit`**
para leer la cadena —es el que usa el cliente que genera Codama— y
**`web3.js`**, que el wallet adapter necesita para firmar. `conexion.ts`
explica la división.

---

## Si algo falla

| Síntoma | Causa |
|---|---|
| El botón no muestra ninguna wallet | Estás en el visor de VS Code, no en el navegador |
| Conecta pero el saldo sale en 0 | La wallet está en mainnet, no en devnet |
| `npm run cliente` no encuentra el IDL | Falta `idl.json` en la raíz |
| El cliente generado apunta a otro programa | El `address` del IDL no es el tuyo |
