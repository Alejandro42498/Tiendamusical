import express from "express";
import {read, write} from "../utils/files.js";
import dayjs from "dayjs";
export const instrumentsFileRouter = express.Router();

instrumentsFileRouter.get("/", (req, res) => {
    let Instruments = read();
    let done = req.query.done;
    //Cambiar done de string a boolean
    if (done === 'true') {
        done = true;
    } else if (done === 'false') {
        done = false;
    }
    console.log('req.query', req.query);
    console.log('Instruments', Instruments);
    if (req.query.done || req.query.limit) {
        Instruments = req.query.done ? Instruments.filter(instrument => instrument.done === done): Instruments;
        Instruments = req.query.limit ? Instruments.slice(0, parseInt(req.query.limit)) : Instruments;
        res.json(Instruments);
        return;
    }
    console.log('Instruments', Instruments);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(Instruments));
})

instrumentsFileRouter.post('/',
    (req, res, next) => {
        req.body.ip = req.ip;
        req.body.created_at = dayjs().format('HH:mm DD-MM-YYYY');
        next();
    }, 
    (req, res) => {
    const Instruments = read();
    //Añadir ID a los datos recibidos
    const instrument = {
        ...req.body, //Spread operator
        id: Instruments.length + 1
    }
    Instruments.push(instrument);
    //fs.writeFileSync('Instruments.json', JSON.stringify(Instruments));
    write(Instruments);
    //Código HTTP 201 Created
    res.status(201).json(Instruments);
})

instrumentsFileRouter.get('/:id', (req, res) => {
    const Instruments = read();
    const instrument = Instruments.find(instrument => instrument.id === parseInt(req.params.id));
    if (instrument) {
        res.json(instrument);
    } else {
        res.status(404).end();
    }
})

instrumentsFileRouter.put('/:id', 
    (req, res, next) => {
        req.body.ip = req.ip;
        req.body.updated_at = dayjs().format('HH:mm DD-MM-YYYY');
        next();
    }, 
    (req, res) => {
        const Instruments = read();
        let instrument = Instruments.find(instrument => instrument.id === parseInt(req.params.id));
        if (instrument) {
            //Actualizar instrument
            instrument = {
                ...instrument,
                ...req.body
            }
            //Actualizar instrument en el array
            Instruments[
                Instruments.findIndex(instrument => instrument.id === parseInt(req.params.id))
            ] = instrument;
            //fs.writeFileSync('Instruments.json', JSON.stringify(Instruments));
            write(Instruments);
            res.json(instrument);
        } else {
            res.status(404).end();
        }
    }
)

instrumentsFileRouter.put('/update/to/done', (req, res) => {
    let Instruments = read();
    Instruments = Instruments.map(instrument => {
        instrument.done = true;
        instrument.updated_at = dayjs().format('HH:mm DD-MM-YYYY');
        return instrument;
    });
    write(Instruments);
    res.json(Instruments);
})

instrumentsFileRouter.delete('/:id', (req, res) => {
    const Instruments = read();
    const instrument = Instruments.find(instrument => instrument.id === parseInt(req.params.id));
    if (instrument) {
        //Eliminar instrument
        Instruments.splice(
            Instruments.findIndex(instrument => instrument.id === parseInt(req.params.id)),
            1
        );
        //fs.writeFileSync('Instruments.json', JSON.stringify(Instruments));
        write(Instruments);
        res.json(instrument);
    } else {
        res.status(404).end();
    }
})