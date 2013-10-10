# Cilantro

[![Build Status](https://travis-ci.org/cbmi/cilantro.png?branch=2.1)](https://travis-ci.org/cbmi/cilantro) [![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/cbmi/cilantro/trend.png)](https://bitdeli.com/free "Bitdeli Badge") [![devDependency Status](https://david-dm.org/cbmi/cilantro/dev-status.png)](https://david-dm.org/cbmi/cilantro#info=devDependencies)

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
grunt test
```

### Distribution

Distribution builds should only be created off the `develop` branch. This:

- Bumps the version to the final, e.g. `2.0.3-beta` to `2.0.3`
- Tags a release
- Freshly compiles and optimizes code
- Creates zip and tarball binaries
- Prints instructions to push and upload it to GitHub

```bash
grunt release
```
