import express from 'express';
import session from 'express-session';
import 'dotenv/config';
import { routerInstruments } from './routes/index.js';
import { writeLog } from './utils/files.js';
import { configurePassport } from './config/passport.js';
import { cartRouter } from "./routes/cart.router.js";
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

// Configurar parsers para JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: process.env.SESSION_SECRET || 'secret',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false } 
    })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de directorios estáticos
app.use(express.static(path.join(__dirname, "public")));

// Configurar motor de vistas
app.set('view engine', 'ejs');
app.set('views', './views');

// Configurar Passport
configurePassport(app);

// Crear Middleware 
app.use((req, res, next) => {
    console.log('Middleware');
    writeLog(req);
    next();
});

// Rutas
app.use("/cart", cartRouter);
routerInstruments(app);


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
