import Transport from "./src/transport-seedz";

(async () => {
  const t = new Transport('')
    console.log(await t.send('cliente', [{ entity: "cliente", qntPages: 1, qntRegisters: 1 }] ));
    console.log(await t.send('cliente', [{ entity: "cliente", qntPages: 1, qntRegisters: 1 }] ));
    console.log(await t.send('cliente', [{ entity: "cliente", qntPages: 1, qntRegisters: 1 }] ));
    console.log(await t.send('cliente', [{ entity: "cliente", qntPages: 1, qntRegisters: 1 }] ));

})();
