import { defineInstruments } from './instruments.model.js'
import { defineUsers } from './users.model.js'

export function defineModels(sequelize){
    defineInstruments(sequelize)
    defineUsers(sequelize)
}


