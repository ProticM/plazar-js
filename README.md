<p align="center">
  <a href="https://github.com/ProticM/plazar-js">
    <img src="http://www.plazarjs.com/content/images/logo-large.png" width="200" height="200" />
  </a>
  <h1 align="center">plazar-js</h1>
  <p align="center">
Is a versatile framework build to enrich the developer experience in terms of simplicity and speed of application development.
</p>
</p>

## Installation

Place the script tag on your page:
```
<script src="..script-path/plazar-js.min.js"> 
```
Optionally, you can include Bootstrap UI:
```
<script src="..script-path/plazar-js-ui-bootstrap.min.js">
```

## Introduction

The framework itself has no dependencies and by leaning on Object-Oriented-Principles (OOP) it can easily be used to create a large Single-Page Application or it can be integrated to a portion of a web page where a dynamic workflow is required.

##### TL;DR

1. Can define components, mixins or classes by invoking `plz.define`.
2. Reuse each type later in the app as much as needed. One type, multiple instances.
3. Extend each type with another by setting the `ownerType`.
4. Override parent method implementation.
5. Each method overridden in a child type can call its parent by invoking `this.base(arguments)`.

## Core Features

1. Modularity
2. Components
3. Mixins
4. Classes
5. Scalability
6. Inheritance
7. Bindings and Templating
8. Inline Templates
9. Pre-Rendered Templates (attach the component to already rendered html)
10. Async Templates and/or ViewModel loading
11. Utils (Array, Object, String...)

## Bootstrap Integration (bootstrap-ui)

plazar-js has a set of components styled with [Bootstrap](http://getbootstrap.com/) v4.1.x which are ready to use in your app out of the box.

## Getting Started and Documentation

Detailed documentation can be found <a href="http://www.plazarjs.com">here</a>.

## Deploy

plazar-js uses [gulp](http://gulpjs.com/) as its build tool. Run the following task to deploy the source into `dist`.

```
$ gulp build
```

## Bugs and Issues

1. A bug is taken into account only if it can be reproduced on the latest master.
2. Open an issue on GitHub to request a fix.

## Browser Support

plazar-js supports all ECMAScript 5 compliant browsers. Check out the <a href="http://kangax.github.io/compat-table/es5/">compatibility table</a>.

#### IE Browser Support

Every implementation/change is done in a way to ignore IE version 9 and lower.

## Plans

Some of the next major releases will contain:

1. Core plazar-ui (set of controls out of the box). This will eliminate the need for any external CSS framework integration. Of course, you would still be able to integrate any of them if you choose so.
2. Typescript support.

## Licence

<a href="https://github.com/ProticM/plazar-js/blob/master/LICENSE">MIT</a>
