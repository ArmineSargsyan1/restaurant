import * as Models from "./models/index.js";

(async () => {
  try {
    const list = [
      Models.Restaurant,
    ];

    for (const model of list) {
      await model.sync({ alter: true });
      console.log(`${model.name} synced successfully`);
    }


  } catch (e) {
    console.error("Error:", e);
  }
})();
