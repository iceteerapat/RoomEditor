import CreateAccountRepository from './CreateAccountRepository';
import LoginRepository from './LoginRepository';
import RoomServiceRepository from './RoomServiceRepository';

const repositories = {
    'CreateAccountRepository': CreateAccountRepository,
    'LoginRepository': LoginRepository,
    'RoomServiceRepository': RoomServiceRepository
}

export default {
    get: name => repositories[name]
};