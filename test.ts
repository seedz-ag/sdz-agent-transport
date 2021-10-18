import Transport from "./src/transport-generic";

(async () => {
  const t = new Transport(
    {
      auth: {
        credentials: {
          username: "rubens.curvello@seedz.ag",
          password: "senha@2021",
        },
        response: "accessToken",
        type: "data",
        url: "auth/login",
      },
      clientes: {
        url: "/data/receive",
      },
      plan: {
        response: "protocol",
        type: "data",
        url: "/processing/planning",
      },
    },
    "https://landing.dev.seedz.ag/api/v1/"
  );
  try {
    await t.authenticate();
    console.log(t);
    console.log(await t.process('plan', { summary: [{ entity: "cliente", qntPages: 1, qntRegisters: 1 }] }));
    console.log(await t.process('clientes', { entity: "cliente", content: [], page: 0 }));
  } catch (e) {
    console.log(e);
  }
})();
