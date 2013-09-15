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
