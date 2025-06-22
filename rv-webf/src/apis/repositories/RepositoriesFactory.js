import CreateAccountRepository from './CreateAccountRepository';
import AuthRepository from './AuthRepository';
import RoomServiceRepository from './RoomServiceRepository';
import PurchaseRepository from './PurchaseRepository';

const repositories = {
    'CreateAccountRepository': CreateAccountRepository,
    'AuthRepository': AuthRepository,
    'RoomServiceRepository': RoomServiceRepository,
    'PurchaseRepository': PurchaseRepository
}

export default {
    get: name => repositories[name]
};