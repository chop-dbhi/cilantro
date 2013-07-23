---
layout: page
title: "Local Setup"
category: dev
date: 2013-06-06 16:36:26
---

## Dependencies

- [NodeJS](http://nodejs.org)
    - OS X - `brew install node` (requires [Homebrew](http://mxcl.github.io/homebrew/))
    - Linux - Typically available through your distribution's package manager
    - Windows - Binaries available the [downloads page](http://nodejs.org/download/)
- [Ruby](http://www.ruby-lang.org/)
    - OS X - Already installed
    - Linux - Typically available through your distribution's package manager
    - Windows - Read more on the [downloads page](http://www.ruby-lang.org/en/downloads/)
- [RubyGems](http://rubygems.org)
    - OS X - Already installed
    - Linux - Typically available through your distribution's package manager
    - Windows - Read more on the [downloads page](http://rubygems.org/download)
- [Sass](http://sass-lang.com/) 3.3.0+
    - Any OS - `gem install sass --pre`
        - The `--pre` flag is required as of the time of this writing


## Setup

### Clone and Branch

```bash
git clone git@github.com:cbmi/cilantro.git
git checkout -b issue-N develop
```

### Development Dependencies

The [Node Package Manager (NPM)](https://npmjs.org) is used to install [Grunt](http://gruntjs.com) and all the other packages for building and testing the code base.

```bash
npm install
```

### The "work" Task

This copies and symlinks a few files and performs the initial compilation of CoffeeScript and SCSS files under `local/`. The task ends with a process that will watch for changes in the files in performs the necessary compilation.

```bash
grunt work
```
