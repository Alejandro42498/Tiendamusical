import express from "express";
import { index, create, update, destroy, getProductsGroupedByCategory } from "../services/instruments.service.js";

export const instrumentsViewsRouter = express.Router();

// Ruta para mostrar la lista de categorías e instrumentos
instrumentsViewsRouter.get("/", async (req, res) => {
    try {
        const categories = await getProductsGroupedByCategory();
        res.render("home", { categories, user: req.user || null });
    } catch (error) {
        console.error("Error en GET /:", error.message);
        res.status(500).send("Error al cargar la página de inicio.");
    }
});

// Ruta para mostrar la lista de instrumentos
instrumentsViewsRouter.get("/list", async (req, res) => {
    try {
        const instruments = await index();
        res.render("index", {
            instruments,
            user: req.user || null
        });
    } catch (error) {
        console.error("Error en GET /list:", error.message);
        res.status(500).send("Error al cargar los instrumentos.");
    }
});

// Ruta para agregar un nuevo instrumento
instrumentsViewsRouter.post("/", async (req, res) => {
    try {
        const { name, done, brand, price, category, description } = req.body;
        const isDone = done === "on";
        await create({ name, done: isDone, brand, price, category, description });
        res.redirect("/instruments/list");
    } catch (error) {
        console.error("Error en POST /instruments:", error.message);
        res.status(500).send("Error al crear el instrumento. Por favor, inténtelo de nuevo.");
    }
});

// Ruta para editar un instrumento existente
instrumentsViewsRouter.post("/edit/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, done, brand, price, category, description } = req.body;
        const isDone = done === "on";
        const updatedInstrument = await update(id, { name, done: isDone, brand, price, category, description });
        if (!updatedInstrument) {
            return res.status(404).send("Instrumento no encontrado.");
        }
        res.redirect("/instruments/list");
    } catch (error) {
        console.error("Error en POST /edit/:id:", error.message);
        res.status(500).send("Error al editar el instrumento. Por favor, inténtelo de nuevo.");
    }
});

// Ruta para eliminar un instrumento existente

instrumentsViewsRouter.post('/destroy/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Eliminando instrumento con ID:', id);
        await destroy(id);
        res.json({ success: true, message: 'Instrumento eliminado con éxito.' });
    } catch (error) {
        console.error('Error al eliminar el instrumento:', error.message);
        res.status(500).json({ success: false, message: 'Error al eliminar el instrumento.' });
    }
});


