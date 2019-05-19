# TODO

    - integrate generation of docs to CI
        - used npm run docs
        - execute docs:html
        - use css from typedoc in readme.html
        - put readme.html in root of doc
        - put each documentation in its version dir e.g. versions/0.0.1
        - each gh-page adds to repo (add: true option) new dir
        - update link in readme.html to latest docs
        - replace in docs/index.html tag </body>
            with <script>{here content of src/docs/partials/docs-script.html}</script></body>
