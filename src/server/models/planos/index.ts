import * as Create from './Create';
import * as Count from './Count';
import * as GetAll from './GetAll';
import * as GetById from './GetById';
import * as DeleteById from './DeleteById';

export const PlanosProvider = {
    ...Create,
    ...Count,
    ...GetAll,
    ...GetById,
    ...DeleteById
};