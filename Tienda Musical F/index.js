import express from 'express';
import session from 'express-session';
import 'dotenv/config';
import { routerInstruments } from './routes/index.js';
import { writeLog } from './utils/files.js';
import { configurePassport } from './config/passport.js';
import { cartRouter } from "./routes/cart.router.js";
import path from 'path';
import { fileURLToPath } from 'url';

// Crear instancia de la aplicación
const app = express();

// Obtener directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =============================
// Configuración básica
// =============================

// Configurar parsers para JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de sesiones
app.use(session({
    secret: process.env.SESSION_SECRET || 'mi secreto', // Cambiar por una clave segura
    resave: false, // No guardar la sesión si no hay cambios
    saveUninitialized: true, // Guardar sesiones no inicializadas
    cookie: { secure: false } // Cambiar a true si se usa HTTPS
}));

// Configuración de directorios estáticos
app.use(express.static(path.join(__dirname, "public")));

// Configurar motor de vistas
app.set('view engine', 'ejs');
app.set('views', './views');

// Configurar Passport para autenticación
configurePassport(app);

// =============================
// Middleware personalizado
// =============================
app.use((req, res, next) => {
    console.log('Middleware ejecutado');
    writeLog(req); // Registrar información del request
    next();
});

// =============================
// Rutas
// =============================
app.use("/cart", cartRouter); // Rutas para carrito de compras
routerInstruments(app); // Otras rutas

// =============================
// Iniciar el servidor
// =============================
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
