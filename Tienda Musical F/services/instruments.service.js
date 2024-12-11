import { sequelize } from '../libs/sequelize.js';

async function index() {
    console.log('INDEX /api/v1/instruments');
    const instruments = await sequelize.models.Instrument.findAll(); // Asegúrate de usar "Instrument"
    return instruments;
}

async function create(instrument) {
    console.log('CREATE /api/v1/instruments');
    const newInstrument = await sequelize.models.Instrument.create({
        name: instrument.name,
        done: instrument.done || false,
        brand: instrument.brand || null,
        price: instrument.price || null,
        category: instrument.category || null,
        description: instrument.description || null,
        imagePath: instrument.imagePath || 'images/', // Ruta relativa para la imagen
    });
    return newInstrument;
}

async function show(id) {
    console.log('SHOW /api/v1/instruments/:id');
    const instrument = await sequelize.models.Instrument.findByPk(id); // Asegúrate de usar "Instrument"
    return instrument;
}

async function update(id, instrument) {
    console.log('UPDATE /api/v1/instruments/:id');
    const searchedInstrument = await sequelize.models.Instrument.findByPk(id); // Asegúrate de usar "Instrument"
    if (!searchedInstrument) {
        return false;
    }

    const [rowsAffected, [updatedInstrument]] = await sequelize.models.Instrument.update({
        name: instrument.name,
        done: instrument.done || false,
        brand: instrument.brand || null,
        price: instrument.price || null,
        category: instrument.category || null,
        description: instrument.description || null,
        imagePath: instrument.imagePath || 'images/', // Actualizar ruta de imagen
    }, {
        where: { id },
        returning: true
    });
    return updatedInstrument;
}

async function destroy(id) {
    console.log('DESTROY /api/v1/instruments/:id');
    const instrument = await sequelize.models.Instrument.findByPk(id); // Asegúrate de usar "Instrument"
    if (!instrument) {
        return false;
    }

    await sequelize.models.Instrument.destroy({ // Asegúrate de usar "Instrument"
        where: {
            id
        }
    });
    return instrument;
}

async function getProductsGroupedByCategory() {
    console.log('GET PRODUCTS GROUPED BY CATEGORY');
    const products = await sequelize.models.Instrument.findAll(); // Asegúrate de usar "Instrument"
    const categories = {};

    // Agrupar productos por categoría
    products.forEach(product => {
        if (!categories[product.category]) {
            categories[product.category] = { name: product.category, products: [] };
        }
        categories[product.category].products.push({
            id: product.id,
            name: product.name,
            price: product.price,
            imagePath: product.imagePath, // Agregar imagen en la agrupación
        });
    });

    // Convertir objeto a arreglo
    return Object.values(categories);
}

export {
    index,
    create,
    show,
    update,
    destroy,
    getProductsGroupedByCategory
};
