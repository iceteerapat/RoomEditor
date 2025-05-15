import CreateAccountRepository from './CreateAccountRepository';
import LoginRepository from './LoginRepository';

const repositories = {
    'CreateAccountRepository': CreateAccountRepository,
    'LoginRepository': LoginRepository
}

export default {
    get: name => repositories[name]
};