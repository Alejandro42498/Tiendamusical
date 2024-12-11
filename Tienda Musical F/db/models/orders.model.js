import { DataTypes } from "sequelize";
import { sequelize } from "../../libs/sequelize";

// Definir el modelo Order
export function defineOrder (sequelize) {
}  sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    customerName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    totalPrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            isFloat: true,
            min: 0,
        },
    },
    productIds: {
        type: DataTypes.ARRAY(DataTypes.INTEGER), // Guarda una lista de IDs de productos
        allowNull: false,
        defaultValue: [],
    },
}, {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
    tableName: "orders", // Nombre de la tabla en la base de datos
});

export default Order;
