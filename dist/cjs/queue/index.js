"use strict";
exports.__esModule = true;
exports.Queue = void 0;
var env_1 = require("../utils/env.js");
var queue_1 = require("./queue.js");
var queue_dev_1 = require("./queue.dev.js");
var Queue = (0, env_1.isLocalEnvironment)() ? queue_dev_1.QueueDev : queue_1.QueueProd;
exports.Queue = Queue;
//# sourceMappingURL=index.js.map