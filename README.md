## Initialize the Server

```sh
$ npm install
$ npm install -g ts-node
```

```sh
$ npm run create-env // optional
```

add your ASSETLAYER_APP_SECRET to the .env

## Start the Server

```sh
$ npm run dev
```

## Build the Server to Production

```sh
$ npm start
```

This step should automatically include building a distribution version, but this may need configured depending on host.

### Manually build a distribution version

```sh
$ npm run build
```

## Query the API

The routes in the proxy mirror the structure in the Asset Layer API.

See more: (docs)