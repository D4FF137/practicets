"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const index_1 = __importDefault(require("./routes/index"));
const env_1 = require("./config/env");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = __importDefault(require("./swagger")); // Импортируйте конфигурацию Swagger
(0, db_1.default)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Подключите Swagger UI
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
app.use(index_1.default);
app.listen(env_1.PORT, (err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(`The server started on http://localhost:${env_1.PORT}`);
        console.log(`Swagger UI available at http://localhost:${env_1.PORT}/api-docs`);
    }
});
