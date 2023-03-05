# Setting up
## Server
- Duplicate the `.env.dev` file and rename it to .env
- Make sur that the `DATABASE.HOST` in `config/index.ts` file is set to `process.env.DATABASE_HOST_DOCKER`
- Run `docker-compose up`

## Api testing
- Load `api.json` in **postman_api**
- create two variables : 
```
    token = ''
    url = 'http://localhost:3001'
```
> In every time you login, the token variable is going to be assigned


# Default accounts 
- admin : admin@localhost.com