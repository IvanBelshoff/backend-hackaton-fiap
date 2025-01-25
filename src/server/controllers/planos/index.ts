
import * as Create from './Create';
import * as GetAll from './GetAll';
import * as GetById from './GetById';
import * as DeleteById from './DeleteById';

export const PlanosController = {
    ...Create,
    ...GetAll,
    ...GetById,
    ...DeleteById
};