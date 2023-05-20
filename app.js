import {faker} from '@faker-js/faker';
import  lodash from 'lodash';

let users = [];

for(let i = 0; i < 10; i++) {
    users.push({
        'name': faker.person.firstName(),
        'phone': faker.phone.number('###-##-##-##'),
        'email': faker.internet.email()
    }) ;
}

console.log(users);

let sortedUsers = lodash.sortBy(users, 'name');

console.log(sortedUsers);
