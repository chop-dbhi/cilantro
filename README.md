# Cilantro

[![Build Status](https://travis-ci.org/cbmi/cilantro.png?branch=2.1)](https://travis-ci.org/cbmi/cilantro)

**Documentation**: http://cilantro.harvest.io

## Development

### Dependencies

- Node + NPM
- Ruby + Sass

### Setup

```bash
# Clone the cilantro repo or a fork; go into the directory
git clone git@github.com/cbmi/cilantro.git && cd cilantro

# Installs the dev depenencies including Grunt
npm install

# Run Grunt 'work' task to perform the initial compilation of .coffee
# and .scss files, it finishes by starting a `watch` process
grunt work
```

### Testing

```bash
# Run the tests
grunt test
```

### Distribution

Distribution builds should only be performed on the `develop` branch.

```bash
# Tags a release, freshly compiles and optimizes code, creates zip and
# tarball binaries and prints instructions to upload it to GitHub
grunt release
```

### Contributing

- If you do not have write access to the repo (i.e. not a core contributor), create a fork of Cilantro
- Branches are used to isolate development and ensure clear and concise intent of the code. Always create a separate branch off `develop` named after the issue number (e.g. issue-123). If there is no issue number, [please create one first](https://github.com/cbmi/cilantro/issues/) before starting your work.
- If working on existing files, ensure the coding style is kept consistent
with the code around it. If creating new files or you are unsure of a pattern
or preference please consult the [style
guides](https://github.com/cbmi/style-guides/).
