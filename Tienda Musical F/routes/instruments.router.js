import express from "express";
export const instrumentsRouter = express.Router();
import { index, create, show, update, destroy } from "../services/instruments.service.js";
import { createInstrumentSchema, getInstrumentSchema, updateInstrumentSchema } from "../schemas/instruments.schema.js";
import { validatorHandler } from "../middleware/validator.handler.js";
import { instrumentsViewsRouter } from "./instruments.views.router.js";

// Obtener todos los instrumentos
instrumentsRouter.get("/", async (req, res) => {
    try {
        const instruments = await index(); // Obtén los datos de los instrumentos
        res.render("index", { instruments, user: req.user || null }); // Renderiza la vista del CRUD
    } catch (error) {
        console.error("Error en GET /:", error.message);
        res.status(500).send("Error al cargar los instrumentos.");
    }
});

// Crear un nuevo instrumento
instrumentsRouter.post(
    '/',
    validatorHandler(createInstrumentSchema, 'body'),
    async (req, res) => {
        try {
            const instrument = req.body;
            const newInstrument = await create(instrument);
            console.log('POST /api/v1/instruments');

            // Redirigir a la lista de instrumentos tras la creación
            res.redirect('/instruments/');
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    }
);

// Actualizar un instrumento por ID
instrumentsRouter.post(
    '/edit/:id',
    validatorHandler(getInstrumentSchema, 'params'),
    validatorHandler(updateInstrumentSchema, 'body'),
    async (req, res) => {
        try {
            const id = req.params.id;
            const instrument = req.body;
            const updatedInstrument = await update(id, instrument);
            console.log(`POST /instruments/edit/${id}`);

            if (!updatedInstrument) {
                return res.status(404).json({ success: false, error: 'Instrument not found' });
            }
            // Redirigir a la lista de instrumentos tras la edición
            res.redirect('/instruments/');
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    }
);

// Obtener un instrumento por ID
instrumentsRouter.get(
    '/:id',
    validatorHandler(getInstrumentSchema, 'params'),
    async (req, res) => {
        try {
            const id = req.params.id;
            const instrument = await show(id);
            console.log(`GET /api/v1/instruments/${id}`);
            if (!instrument) {
                return res.status(404).json({ success: false, error: 'Instrument not found' });
            }
            res.status(200).json({ success: true, data: instrument });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    }
);

// Eliminar un instrumento por ID
/*instrumentsRouter.delete(
    '/:id',
    validatorHandler(getInstrumentSchema, 'params'),
    async (req, res) => {
        try {
            const id = req.params.id;
            const instrument = await destroy(id);
            console.log(`DELETE /api/v1/instruments/${id}`);
            if (!instrument) {
                return res.status(404).json({ success: false, error: 'Instrument not found', deleted: false });
            }
            res.status(200).json({ success: true, data: instrument, deleted: true });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    }
);*/

instrumentsRouter.post("/destroy/:id", async (req, res) => {
    console.log("params", req.params);
    const { id } = req.params;
    await destroy(id);
    res.redirect("/instruments");
})