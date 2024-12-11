import express from 'express';
import { sequelize } from '../libs/sequelize.js'; // Asegúrate de importar Sequelize correctamente

export const cartRouter = express.Router();
const Instrument = sequelize.models.Instrument; // Asegúrate de que el modelo esté registrado en Sequelize

// Ruta para agregar un producto al carrito
cartRouter.post('/add', async (req, res) => {
    try {
        const { productId } = req.body;

        if (!req.session) {
            return res.status(500).json({ error: 'Session is not initialized' });
        }

        if (!req.session.cart) {
            req.session.cart = [];
        }

// Ruta para vaciar el carrito
cartRouter.post('/clear', (req, res) => {
    try {
        if (!req.session) {
            return res.status(500).json({ error: 'Session is not initialized' });
        }

        // Vaciar completamente el carrito
        req.session.cart = []; // Asignar un arreglo vacío

        console.log("Carrito vaciado:", req.session.cart);

        res.status(200).json({ success: true, message: 'Carrito vaciado exitosamente.' });
    } catch (error) {
        console.error('Error al vaciar el carrito:', error.message);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

        // Verificar si el producto ya está en el carrito
        const existingProduct = req.session.cart.find(item => item.id === parseInt(productId, 10));

        if (existingProduct) {
            // Incrementar la cantidad si ya existe
            existingProduct.quantity += 1;
        } else {
            // Buscar el producto en la base de datos para obtener su información
            const product = await Instrument.findByPk(productId);
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }

            // Agregar el producto al carrito
            req.session.cart.push({
                id: productId,
                name: product.name,
                price: product.price,
                quantity: 1
            });
        }

        console.log("Current cart:", req.session.cart);

        res.render('cart', { 
            message: "Carrito de compras",
            cart: req.session.cart
        });
    } catch (error) {
        console.error('Error adding product to cart:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Ruta para mostrar el carrito
cartRouter.get('/', (req, res) => {
    try {
        if (!req.session) {
            return res.status(500).json({ error: 'Session is not initialized' });
        }

        const cart = req.session.cart || [];
        res.render('cart', { 
            message: "Current cart contents",
            cart
        });
    } catch (error) {
        console.error('Error fetching cart contents:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});
