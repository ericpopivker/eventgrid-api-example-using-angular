# Eventgrid API example using AngularJS
Example web application that demonstrates how to consume Eventgrid API using Angular and Node.js

### API Reference

[https://apidoc.eventgrid.com][api]

### Running Demo

[http://register-eventgrid.rhcloud.com/Events/21285][demo]

### Setup

You need Gulp and Bower installed globally

```sh
$ npm i -g gulp
```

```sh
$ npm i -g bower
```

Install server-side dependencies

```sh
$ npm install
```

Install client-side dependencies

```sh
$ bower install
```

Build scripts, tempates and styles into single bundle

```sh
$ gulp
```

Start app

```sh
$ node server
```

or start app in dev mode(without bundling)

```sh
$ node server dev
```


[demo]: <http://register-eventgrid.rhcloud.com/Events/21285>
[api]: <https://apidoc.eventgrid.com/>
