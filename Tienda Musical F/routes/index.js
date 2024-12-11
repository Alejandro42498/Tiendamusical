import express from "express";
import { instrumentsFileRouter } from "./instruments.file.router.js";
import { instrumentsRouter } from "./instruments.router.js";
import { instrumentsViewsRouter } from "./instruments.views.router.js";
import { authRouter } from "./auth.router.js";
//import { ordersRouter } from "./orders.router.js";

export function routerInstruments(app) {
    // Rutas de autenticación
    app.use("/auth", authRouter);

    // Rutas de vistas de instrumentos
    app.use("/instruments", instrumentsRouter);
    
    // API para gestionar instrumentos
    const apiRouter = express.Router();
    apiRouter.use("/file/instruments", instrumentsFileRouter);
    apiRouter.use("/instruments", instrumentsRouter);

    app.use("/api/v1", apiRouter);

    // Ruta base para vistas generales
    app.use("/", instrumentsViewsRouter);
}

export function ordersRouter(app) {
    // Rutas de vistas de pedidos
    app.use("/orders", ordersRouter);
}