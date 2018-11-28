# plazarjs/http

> PlazarJS http/ajax helper methods.

## Usage - es

```javascript
$ npm install @plazarjs/http
```

Create a folder called `plugins`. Inside of it create a file called `http.js` and copy the following snippet:

```javascript
import pz from '@plazarjs/core';
import pzHttp from '@plazarjs/http';
pz.plugin(pzHttp);
```

## Usage - cdn

```html
// include the required scripts before closing the body tag
<script src="https://cdn.jsdelivr.net/npm/@plazarjs/core/dist/core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@plazarjs/http/dist/http.min.js"></script>

// initialize the plugin
<script>
  pz.plugin(pzHttp);
</script>
```

Detailed documentation can be found <a href="http://www.plazarjs.com">here</a>.