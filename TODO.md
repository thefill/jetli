# TODO:

- set CI with circle-ci
- integrate generation of docs to CI
- replace root README.md 
    - add there converted to markdown content of src/doc/MARKDOWN.html
    - use https://github.com/showdownjs/showdown/wiki/CLI-tool to convert md to 
      html on the fly before "npm run docs:html"
    - use showdown extension to replace pre with typekit element e.g. <div id="my-element">
    - generate html page
- publish gh page with docs, md, coverage & badges
- add shields https://shields.io/ for: issues open, node version, dependencies: 0, types: typescript
- add coverage threshold config for jest:
  > "coverageThreshold": {
  >     "global": {
  >       "branches": 80,
  >       "functions": 80,
  >       "lines": 80,
  >       "statements": -10
  >     }
  >   }
