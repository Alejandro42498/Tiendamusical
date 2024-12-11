import { Sequelize } from "sequelize";
import pgtools from "pgtools"; // Para crear la base de datos automáticamente
import { defineModels } from "../db/models/index.js";


const DB_NAME = 'Tienda-musical';
const DB_USER = 'postgres';
const DB_PASS = '1';
const DB_HOST = '127.0.0.1';
const DB_PORT = '5432';

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: "postgres",
});

// Función para crear la base de datos si no existe
async function createDatabaseIfNotExists() {
    try {
        await pgtools.createdb(
            {
                user: DB_USER,
                password: DB_PASS,
                host: DB_HOST,
                port: DB_PORT,
            },
            DB_NAME
        );
        console.log(`Database "${DB_NAME}" created successfully.`);
    } catch (err) {
        if (err.name === "duplicate_database") {
            console.log(`Database "${DB_NAME}" already exists.`);
        } else {
            console.error(`Error creating database: ${err.message}`);
            throw err;
        }
    }
}

// Ejecutar la creación de la base de datos
await createDatabaseIfNotExists();

// Definir modelos
defineModels(sequelize);

try {
    // Sincronizar modelos con la base de datos
    await sequelize.sync({ force: false }); // Cambia a true si necesitas reiniciar las tablas
    console.log("Database synchronized successfully.");

    // Autenticar la conexión
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
} catch (error) {
    console.error("Unable to connect to the database:", error.message);
}
