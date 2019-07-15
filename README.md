# Chattie

_NOTE: Unless stated otherwise, every command is to be executed from the root of the project._

## Development

This project is using a feature of [Yarn](https://yarnpkg.com/) called [Yarn Workspaces](https://yarnpkg.com/lang/en/docs/workspaces/), so using Yarn is required.

### Install Dependencies

```sh
yarn [install]
```

### Backend

In the `backend` directory, run:

```sh
cd backend
yarn start
```

### Frontend

In the `frontend` directory, run:

```sh
cd frontend
yarn start
```

## Build

```sh
yarn build
```

This script will run the `build` scripts of `backend` and `frontend` and copy the results to a `build` directory at the root of the project.

## Usage

```sh
yarn start
```

### PM2

To use [PM2](http://pm2.keymetrics.io/) you need to have it globally installed:

```sh
yarn global add pm2
```

or:

```sh
npm i -g pm2
```

After you've got it installed, run:

```sh
yarn start:pm2
```

The configuration for PM2 is found in `pm2.json`.
