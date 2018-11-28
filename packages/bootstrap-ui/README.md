# plazarjs/bootstrap-ui

> A set of predefined components styled with the Bootstrap CSS framework (version v4.1.x).

## Usage - es

```javascript
$ npm install @plazarjs/bootstrap-ui
```
## Register all Components

Create a folder called `plugins`. Inside of it create a file called `bootstrap.js` and copy the following snippet:

```javascript
import 'bootstrap';
import pz from '@plazarjs/core';
import pzBootstrap from '@plazarjs/bootstrap-ui';
pz.plugin(pzBootstrap);
```
The snippet above will import the module dependencies and register each bootstrap-ui component. Then, import the plugin script in your app entry point:

```javascript
import '..my-app-relative-path/plugins/bootstrap';
```

## Import a Specific Component

```javascript
import { navbar } from '@plazarjs/bootstrap-ui/dist/esmodules/components';
```

Inheritance is enabled on each component. We could have our custom component created like so:

```javascript
export default navbar.extend(/* configs */);
```

## Usage - cdn

```html
// include the required scripts before closing the body tag
<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/@plazarjs/core/dist/core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@plazarjs/bootstrap-ui/dist/bootstrap-ui.min.js"></script>

// initialize the plugin
<script>
  pz.plugin(pzBootstrap);
</script>

// our app components are listed here
```

Next, we could define our custom derived components via `pz.define` and the `extend` API, or simply create them via `pz.create` if no modifications are required. A quick example:

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

## CSS - es

To import the CSS files you can use your favorite plugin. For example, `rollup.js` or `webpack`.

## CSS - cdn

Place the following `link` tag at the top of your page, within the html `head` tag.

```html
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
```

Detailed documentation can be found <a href="http://www.plazarjs.com">here</a>.