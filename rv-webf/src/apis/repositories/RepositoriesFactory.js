import CreateAccountRepository from './CreateAccountRepository';

const repositories = {
    'CreateAccountRepository': CreateAccountRepository
}

export default {
    get: name => repositories[name]
};