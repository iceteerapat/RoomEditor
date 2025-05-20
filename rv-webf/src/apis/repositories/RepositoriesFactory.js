import CreateAccountRepository from './CreateAccountRepository';
import AuthRepository from './AuthRepository';
import RoomServiceRepository from './RoomServiceRepository';

const repositories = {
    'CreateAccountRepository': CreateAccountRepository,
    'AuthRepository': AuthRepository,
    'RoomServiceRepository': RoomServiceRepository
}

export default {
    get: name => repositories[name]
};