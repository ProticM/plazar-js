<p align="center">
  <a href="https://github.com/ProticM/plazar-js">
    <img src="http://www.plazarjs.com/content/images/logo-large.png" width="200" height="200" />
  </a>
  <h1 align="center">
    PlazarJS
  <a href="https://twitter.com/intent/tweet?text=PlazarJS,%20un%2Dopinionated%20framework%20for%20JavaScript%20built%20to%20enrich%20the%20developer%20experience%20in%20terms%20of%20simplicity%20and%20speed%20of%20application%20development&url=https://github.com/ProticM/plazar%2Djs&hashtags=javascript,webdev,webdevelopment">
    <img src="https://img.shields.io/twitter/url/http/shields.io.svg?style=social" />
  </a>
    <br>
    <a href="https://github.com/lerna/lerna">
    <img src="https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg" alt="lerna" />
    </a>
    <a href="https://www.npmjs.com/package/@plazarjs/core">
    <img src="https://img.shields.io/badge/License-MIT-brightgreen.svg" alt="license-mit" />
    </a>
    <a href="https://www.npmjs.com/package/@plazarjs/core">
    <img src="https://img.shields.io/npm/v/@plazarjs/core.svg?style=flat" alt="version" />
    </a>
    <a href="https://www.npmjs.com/package/@plazarjs/core">
    <img src="https://img.shields.io/npm/dt/@plazarjs/core.svg" alt="downloads" />
    </a>
  </h1>

  <p align="center">
A versatile framework built to enrich the developer experience in terms of simplicity and speed of application development.
</p>
</p>

## Installation

Run the following command:
```bash
$ npm install @plazarjs/core
```
Or, place the script tag on your page:
```html
<script src="https://cdn.jsdelivr.net/npm/@plazarjs/core/dist/core.min.js"></script>
```
Optionally, you can include Bootstrap UI:
```bash
$ npm install @plazarjs/bootstrap-ui
```
```html
<script src="https://cdn.jsdelivr.net/npm/@plazarjs/bootstrap-ui/dist/bootstrap-ui.min.js"></script>
```

## Introduction

PlazarJS is a un-opinionated framework for JavaScript. It has no dependencies and by leaning on Object-Oriented-Principles (OOP) it can easily be used to create a large Single-Page Application or it can be integrated to a portion of a web page where dynamic workflow is required. It's built to be flexible and designed to help you build the application the way you want it without forcing you to follow a path you don't think is suitable for the application you are developing. The main focus is on good old trio, HTML, CSS and JavaScript.

##### TL;DR

1. Can define components, mixins or classes by invoking `pz.define`.
2. Reuse each type later in the app as much as needed. One type, multiple instances.
3. Extend each type with another by setting the `ownerType`.
4. Override parent method implementation.
5. Each method overridden in a child type can call its parent by invoking `this.base(arguments)`.

##### Core Features

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

## Getting Started and Documentation

A quick example:

```javascript
pz.define('user', {
  ownerType: 'class',
  name: 'John',
  surname: 'Doe'
}).create(); // automatically creates the class upon definition

pz.define('my-component', {
  ownerType: 'component',
  template: '<div>My name is: {name}, and my surname is: {surname}</div>',
  renderTo: 'body',
  autoLoad: true,
  viewModel: {
    name: '',
    surname: ''
  },
  setUserData: function(user) {
    this.viewModel.surname = user.surname;
  }
});

var component = pz.define('my-child-component', {
  ownerType: 'my-component',
  setUserData: function(user) {
    this.viewModel.name = user.name;
    this.base(user);
  }
}).create(); // automatically creates the component upon definition

var user = pz.getInstanceOf('user');
component.setUserData(user);
```

Detailed documentation can be found <a href="http://www.plazarjs.com">here</a>.

## Bootstrap Integration (bootstrap-ui)

PlazarJS has a set of components styled with [Bootstrap](http://getbootstrap.com/) v4.1.x which are ready to use in your app out of the box.

A quick example:

```javascript 
pz.create({ 
  autoLoad: true, 
  renderTo: 'body', 
  type: 'ui-bootstrap-card',
  header: {
    text: 'Login', 
    css: ['bg-info', 'text-white'] 
  },
  components: [{
    type: 'ui-bootstrap-input',
    labelText: 'Email:',
    placeholder: 'Enter email...'
  }, {
    type: 'ui-bootstrap-input',
    labelText: 'Password:',
    placeholder: 'Enter password...',
    css: ['mb-2']
  }, {
    type: 'ui-bootstrap-input',
    inputType: 'checkbox',
    labelText: 'Remember me'
  }],
  buttons: [{
    text: 'Login',
    appearance: 'outline-info',
    align: 'right'
  }]
  // other configs 
});
```
Output:
<p align="center">
  <a href="https://github.com/ProticM/plazar-js">
    <img src="http://www.plazarjs.com/content/images/bootstrap-example-2.png" width="600" />
  </a>
</p>

Detailed documentation can be found <a href="http://www.plazarjs.com">here</a>.

## Contribution

Please read the <a href="https://github.com/ProticM/plazar-js/blob/master/CONTRIBUTING.md">Contributing Guide</a> before making a pull request.

## Browser Support

PlazarJS supports all ECMAScript 5 compliant browsers. Check out the <a href="http://kangax.github.io/compat-table/es5/">compatibility table</a>.

#### IE Browser Support

Every implementation/change is done in a way to ignore IE version 9 and lower.

## Plans

Some of the next major releases will contain:

1. Core plazar-ui (set of controls out of the box). This will eliminate the need for any external CSS framework integration. Of course, you would still be able to integrate any of them if you choose so.
2. Typescript support.

## License

<a href="https://github.com/ProticM/plazar-js/blob/master/LICENSE">MIT</a>
