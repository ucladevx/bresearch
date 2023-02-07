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

Assuming we want to use a database called `bresearchdev` we create it by logging into `psql` with `postgres` user. Then create a password using `\p` and follow the prompts. Memorize the password for the DB connection string. Create the database with `\c bresearchdev`.

### Environment Variables

Create a `.env` (`.env.production` should contain the production AWS url). Set `DATABASE_URL="postgresql://postgres:<YOUR PASSWORD HERE>@localhost:5432/bresearchdev?schema=public"`. Prisma should now be able to seed data using `npx prisma db seed` and `npx prisma studio` should reflect those changes.
