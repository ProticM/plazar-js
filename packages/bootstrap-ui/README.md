# plazarjs/bootstrap-ui

> A set of predefined components styled with the Bootstrap CSS framework (version v4.1.x).

## Usage - es

```javascript
$ npm install @plazarjs/bootstrap-ui
```
## Register all Components

Create a folder called `plugins`. Inside of it create a file called `bootstrap.js` and copy the following snippet:

```javascript
import pz from '@plazarjs/core';
import pzBootstrap from '@plazarjs/bootstrap-ui';
pz.plugin(pzBootstrap);
```
The snippet above will register each bootstrap component and the UI will be ready for use. Then, import the jquery library and register the bootstrap plugin in your app entry point:

```javascript
import $ from 'jquery';
import '..my-app-relative-path/plugins/bootstrap';
```

## Import a Specific Component

```javascript
import { navbar } from '@plazarjs/bootstrap-ui/dist/esmodules/components';
```

Inheritance is enabled on each component. We could have our custom component created like so:

```javascript
navbar.extend(/* configs */);
```

## Usage - cdn

```html
<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/@plazarjs/core/dist/core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@plazarjs/bootstrap-ui/dist/bootstrap-ui.min.js"></script>
```

Next, we could define our custom derived components via `pz.define` and the `extend` API, or simply create them via `pz.create`.

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