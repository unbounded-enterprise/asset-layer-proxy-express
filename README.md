## Initialize the Server

```sh
$ npm install
```

```sh
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

## Adding as a remote to your project

As an alternative to forking the repo, you can merge from a remote:

```sh
$ git remote add asset-layer-proxy-express https://github.com/unbounded-enterprise/asset-layer-proxy-express.git
```

```sh
$ git fetch asset-layer-proxy-express
```

Now in your editor, confirm you're on the branch you want to merge into, then:

```sh
$ git merge asset-layer-proxy-express/main
```

Finally, push the merge commit to your repo, IE:

```sh
$ git push -u origin main
```