"use strict";

module.exports = function (app: any) {
  var shortenerHandler = require("../handler/shortener.handler");

  app.route("/").get(shortenerHandler.getURL).post(shortenerHandler.create);
};
