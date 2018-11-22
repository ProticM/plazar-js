# plazarjs/bootstrap-ui

> A set of predefined components styled with the Bootstrap CSS framework (version v4.1.x). Currently, this package should be used only in non module environments.

## Usage

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