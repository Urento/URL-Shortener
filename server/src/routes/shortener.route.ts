"use strict";

module.exports = function (app: any) {
  var shortenerHandler = require("../handler/shortener.handler");

  app.route("/").post(shortenerHandler.create);

  app.route("/:id").get(shortenerHandler.getURL);
};
