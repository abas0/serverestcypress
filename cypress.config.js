const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: null, // não há URL fixa
    setupNodeEvents(on, config) {
      return config
    },
  },
});
