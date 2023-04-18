# Setup Development Database

## Install Postgres Locally

#### Linux (Ubuntu/Debian/WSL 2)

```bash
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt-get update
sudo apt-get -y install postgresql
```

Starting `psql` on WSL 2 is done with `sudo service postgresql start`

#### MacOS

[Follow these instructions (use Homebrew)](https://wiki.postgresql.org/wiki/Homebrew)

### Setup Database

Assuming we want to use a database called `bresearchdev`.
We log into postgres using `psql postgres`.

Then find out your username using `\du` and create a password using `\password <YourUserName>` and follow the prompts. Memorize the password for the DB connection string.

Create the database with `CREATE DATABASE bresearchdev;`
Connect to the database with `\c bresearchdev`.

_You can double check your current databases using `\l`_

### Environment Variables

Create a `.env` (`.env.production` should contain the production AWS url). Set `DATABASE_URL=postgresql://<YOUR POSTGRES USERNAME>:<YOUR PASSWORD HERE>@localhost:5432/bresearchdev?schema=public"`

### Adding Prisma

Run the following command in the same directory as your `package.json` to migrate your current prisma schema to the database.

```bash
npx prisma migrate dev --name <migration name>
```

**Warning: check if you have docker running in the background and already running the server at port 5432.**
if so, go to postgresql's config file to change the default port:
`psql postgres -c 'SHOW config_file'`
and then uncomment `port=5432` and change the port to a port number of your choice.

### Running Prisma

Prisma should now be able to seed data using `npx prisma db seed` and `npx prisma studio` should reflect those changes.

#### Tracking Migrations

Make sure to track your migration files with `git`
