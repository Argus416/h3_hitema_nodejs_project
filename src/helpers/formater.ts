import { faker } from '@faker-js/faker';

export const createUsername = (prefix: string | string[]):string =>{
    const randomNumber = faker.datatype.number()
    let prefixes :string | string[] = [...prefix]

    prefixes = prefixes.map(e => e[0]).concat(`${randomNumber}`).join('')

    return prefixes
}
