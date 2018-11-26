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
    <a href="https://www.jsdelivr.com/package/npm/@plazarjs/core">
    <img src="https://data.jsdelivr.com/v1/package/npm/@plazarjs/core/badge?style=rounded" alt="jsdelivr" />
    </a>
  </h1>

  <p align="center">
A versatile framework built to enrich the developer experience in terms of simplicity and speed of application development.
</p>
</p>

## Table of Contents

- [Installation](#installation)
- [Introduction](#introduction)
- [Getting Started and Documentation](#getting-started-and-documentation)
- [Bootstrap Integration](#bootstrap-integration)
- [Contribution](#contribution)
- [Browser Support](#browser-support)
- [Plans](#plans)

## Installation

Note that we are still in alpha therefore some packages might not exists after the official release.

Run the following npm command:
```bash
$ npm install @plazarjs/core
```
Or, place the script tag on your page:
```html
<script src="https://cdn.jsdelivr.net/npm/@plazarjs/core/dist/core.min.js"></script>
```
Check out the list of available dependant <a href="https://github.com/ProticM/plazar-js/blob/master/PACKAGES.md">packages</a>.

## Introduction

PlazarJS is a un-opinionated framework for JavaScript. It has no dependencies and by leaning on Object-Oriented-Principles (OOP) it can easily be used to create a large Single-Page Application or it can be integrated to a portion of a web page where dynamic workflow is required. It's built to be flexible and designed to help you build the application the way you want it without forcing you to follow a path you don't think is suitable for the application you are developing. The main focus is on good old trio, HTML, CSS and JavaScript.

##### TL;DR

1. Can define components, mixins or classes by invoking `pz.define`, `pz.component.extend` or `pz.class.extend`. Mixins are not extendable.
2. Reuse each type later in the app as much as needed. One type, multiple instances.
3. Extend each type with another by setting the `ownerType`. Note that this config is not required when using the `extend` approach. The `ownerType` is automatically recognized.
4. Override parent method implementation.
5. Each method overridden in a child type can call its parent by invoking `this.base(arguments)`.

##### Core Features

1. Modularity
2. Components
3. Mixins
4. Classes
5. Inheritance
6. Bindings and Templating (inline, pre-rendered, async templates)

## Getting Started and Documentation

A quick example:

```javascript
// button definition with default options
pz.define('button-component', {
  ownerType: 'component',
  template: '<button type="button"></button>',
  text: 'Button',
  renderTo: 'div.buttons',
  init: function() {
    this.base();
    this.html.innerText = this.text;
  },
  handlers: [{
    on: 'click',
    fn: 'onClick'
  }],
  onClick: function() { }
});

pz.define('header-component', {
  ownerType: 'component',
  template: '<header>Welcome to PlazarJS - {year}</header>',
  viewModel: {
    year: '2018'
  },
  components: [{ // reuse the button with another config
    type: 'button-component',
    text: 'Header button',
    renderTo: 'root', // we don't have div.buttons element within our header
    onClick: function() { 
      alert('Hello from Header!');
    }
  }]
});

pz.define('body-component', {
  ownerType: 'component',
  template: '<main>{text}<div class="buttons"></div></main>',
  viewModel: {
    text: 'This is the body component! I can have child component as well. Like the button bellow:'
  },
  components: [{ // reuse the button with another config
    type: 'button-component',
    onClick: function() { 
      alert('Hello from Body!');
    }
  }]
});

pz.define('layout-component', {
  ownerType: 'component',
  templateSelector: 'body',
  autoLoad: true,
  components: [{
    type: 'header-component'
  },{
    type: 'body-component'
  }]
}).create(); // automatically creates the component upon definition
```

The equivalent of the code above written with the extend API, which is recommended when in modular environments, looks like this:

```javascript
// button definition with default options
var button = pz.component.extend({ // we would export the definition as a module
  type: 'button-component',
  template: '<button type="button"></button>',
  text: 'Button',
  renderTo: 'div.buttons',
  init: function() {
    this.base();
    this.html.innerText = this.text;
  },
  handlers: [{
    on: 'click',
    fn: 'onClick'
  }],
  onClick: function() { }
});

// here we could also use button.extend({ // configs })
var headerButton = button.create({
    text: 'Header button',
    renderTo: 'root', // we don't have div.buttons element within our header
    onClick: function() { 
      alert('Hello from Header!');
    }
});

var headerComponent = pz.component.extend({
  type: 'header-component',
  template: '<header>Welcome to PlazarJS - {year}</header>',
  viewModel: {
    year: '2018'
  },
  components: [headerButton]
});

var bodyButton = button.extend({
    type: 'body-button-component',
    onClick: function() { 
      alert('Hello from Body!');
    }
});

var bodyComponent = pz.component.extend({ // we would export the definition as a module
  type: 'body-component',
  template: '<main>{text}<div class="buttons"></div></main>',
  viewModel: {
    text: 'This is the body component! I can have child component as well. Like the button bellow:'
  },
  components: [bodyButton]
});

pz.component.extend({ // we would export the definition as a module
  type: 'layout-component',
  templateSelector: 'body',
  autoLoad: true,
  components: [headerComponent, bodyComponent]
}).create(); // automatically creates the component upon definition
```

Detailed documentation can be found <a href="http://www.plazarjs.com">here</a>.

## Bootstrap Integration

Checkout the module integration <a href="https://github.com/ProticM/plazar-js/tree/master/packages/bootstrap-ui">here</a>.

## Contribution

Please read the <a href="https://github.com/ProticM/plazar-js/blob/master/CONTRIBUTING.md">Contributing Guide</a> before making a pull request.

## Browser Support

PlazarJS supports all ECMAScript 5 compliant browsers. Check out the <a href="http://kangax.github.io/compat-table/es5/">compatibility table</a>.

#### IE Browser Support

Every implementation/change is done in a way to ignore IE version 9 and lower.

## Plans

Some of the next major releases will contain:

1. TypeScript support.
2. Core plazar-ui (set of controls out of the box). This will eliminate the need for any external CSS framework integration. Of course, you would still be able to integrate any of them if you choose so.

## License

<a href="https://github.com/ProticM/plazar-js/blob/master/LICENSE">MIT</a>
