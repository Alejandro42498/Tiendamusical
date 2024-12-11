import Joi from 'joi';

const id = Joi.number();
const name = Joi.string().min(5).max(255);
const done = Joi.boolean();

const createInstrumentSchema = Joi.object({
    name: name.required(),
    done: done.optional(),
});

const updateInstrumentSchema = Joi.object({
    name: name.optional(),
    done: done.optional(),
});

const getInstrumentSchema = Joi.object({
    id: id.required(),
});

export {
    createInstrumentSchema,
    updateInstrumentSchema,
    getInstrumentSchema,
};
