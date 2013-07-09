# Cilantro

**Documentation**: http://cbmi.github.io/cbmi/

## Development

### Dependencies

- Node + NPM
- Ruby + Sass

### Setup

```
# Clone the cilantro repo or a fork; go into the directory
git clone git@github.com/cbmi/cilantro.git && cd cilantro

# Installs the dev depenencies including Grunt
npm install

# Run Grunt 'work' task to perform the initial compilation of .coffee
and .scss files, it finishes by starting a `watch` process
grunt work
```

### Testing

```
# Run the tests
grunt test
```

### Distribution

Distribution builds should only be performed on the `develop` branch.

```
# Run Grunt `dist` which will freshly compile, optimize, and test
# a build and write the files to the dist directory
grunt dist

# Switch to the master branch
git checkout master

# Replace the previous files with the contents of the dist directory
ls | grep -v dist | xargs rm -rf; cp -r dist/* .
```

### Contributing

- If you do not have write access to the repo (i.e. not a core contributor), create a fork of Cilantro
- Branches are used to isolate development and ensure clear and concise intent of the code. Always create a separate branch off `develop` named after the issue number (e.g. issue-123). If there is no issue number, [please create one first](https://github.com/cbmi/cilantro/issues/) before starting your work.
- If working on existing files, ensure the coding style is kept consistent
with the code around it. If creating new files or you are unsure of a pattern
or preference please consult the [style
guides](https://github.com/cbmi/style-guides/).
