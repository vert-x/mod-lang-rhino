# Rhino Vert.x API Module

[Build Status](https://vertx.ci.cloudbees.com/view/Javascript/job/vert.x-mod-lang-rhino/)

# Javascript on Vert.x with Rhino

Use Rhino as your language module in Vert.x.  This language module uses the
vert.x Javascript API in [mod-lang-js](https://github.com/vert-x/mod-lang-js)
with the Rhino 1.7R4 runtime. The API documentation is the same as for
`lang-js` and `lang-dynjs`.

Latest Release [API Documentation](http://vertx.io/mod-lang-js/docs/1.0.0/index.html)

HEAD [API Documentation](https://vertx.ci.cloudbees.com/view/Javascript/job/vert.x-mod-lang-js/lastSuccessfulBuild/artifact/target/docs/index.html)

## Usage

This language module is the default JS runtime in Vert.x and will be loaded on
demand for all Javascript applications that do not specify a different Javascript
runtime. Other runtimes available are
[mod-lang-dynjs](https://github.com/vert-x/mod-lang-js) and
[mod-lang-nashorn](https://github.com/vert-x/mod-lang-nashorn).

