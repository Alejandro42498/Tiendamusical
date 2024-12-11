import { DataTypes } from "sequelize";

export function defineInstruments(sequelize) {
    sequelize.define('Instrument', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        done: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        brand: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        category: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        imagePath: { // Campo para la ruta de la imagen
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: 'images/default.jpeg' // Ruta predeterminada para imágenes
        }
    });
};
