# TODO:

- set CI with circle-ci
- integrate generation of docs to CI
- replace root README.md 
    - convert to markdown content of the src/doc/MARKDOWN.html
    - use "npm run docs:readme" to generate README.html
    - combine with api docs
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
