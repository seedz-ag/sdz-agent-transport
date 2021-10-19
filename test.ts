import Transport from "./src/transport-seedz";

(async () => {
  const t = new Transport('')

  try {
    
    console.log(t);
    console.log(await t.send('cliente', { summary: [{ entity: "cliente", qntPages: 1, qntRegisters: 1 }] }));
  } catch (e) {
    console.log(e);
  }
})();
