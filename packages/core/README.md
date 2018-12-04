# plazarjs/core

> PlazarJS standalone package. This package holds the core implementation of the framework and it's all you need to build your app if no predefined UI components are required.

## Usage

```javascript
// define the component
import pz from '@plazarjs/core';

const helloWorld = {
  ownerType: 'component',
  template: '<div>Hello from {fw}</div>',
  renderTo: 'body',
  autoLoad: true,
  viewModel: {
    fw: 'plazarjs'
  }
};

export default pz.define('hello-world', helloWorld);

// create the component where required
import helloWorld from 'my-path/helloWorld';
helloWorld.create();
```

The equivalent of the code above written with the extend API, which is recommended when in modular environments, looks like this:

```javascript
// define the component
import pz from '@plazarjs/core';

const helloWorld = {
  type: 'hello-world',
  template: '<div>Hello from {fw}</div>',
  renderTo: 'body',
  autoLoad: true,
  viewModel: {
    fw: 'plazarjs'
  }
};

export default pz.component.extend(helloWorld);

// create the component where required
import helloWorld from 'my-path/helloWorld';
helloWorld.create();
```

Detailed documentation can be found <a href="http://www.plazarjs.com">here</a>.