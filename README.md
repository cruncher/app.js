<h1>app.js</h1>

A simple and light app toolkit. Declaratively binds data
to dynamic views as defined by data attributes in HTML.

<h2>Launch</h2>

    var app = new App();

<h2>Views</h2>

    <div data-view="name" data-data="path.to.data">
        <h1>Hello world</h1>
    </div>

Where 'name' is the key of a view function in app.views and
'path.to.data' points to an object in app.data. The view is
defined as a function that takes the DOM node and the data
object as arguments:

    app.views['name'] = function(node, data) {
        // Listen for changes to data.
        observe(data, function(data) {
            // Do something to the node.
        });
    };

<h2>Templates</h2>

    <div data-template="name">
        <h1>{{ prop }}</h1>
    </div>

The template is stored as a DOM node in app.templates[name],
and can be cloned and rendered with app.render(name, context),
where context is an object with properties that match template
tags – such as {{ prop }}.

<h2>Data</h2>

Data must be defined before it is needed by a view. In the
case of views already in the DOM, this means before
jQuery(document).ready().

Other than that, there is no restriction about how your data
is organised. The <code>data-data</code> attribute accepts
a dot delimited path so you can find your data in any
arbritrary structure inside of app.data.