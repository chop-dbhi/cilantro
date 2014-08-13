# Contributing

First off, thank you for considering a contribution! Before you submit any code, please read the following Developer's Certificate of Origin (DCO):

```
By making a contribution to the Cilantro project ("Project"),
I represent and warrant that:

a. The contribution was created in whole or in part by me and I have the right
to submit the contribution on my own behalf or on behalf of a third party who
has authorized me to submit this contribution to the Project; or

b. The contribution is based upon previous work that, to the best of my
knowledge, is covered under an appropriate open source license and I have the
right and authorization to submit that work with modifications, whether
created in whole or in part by me, under the same open source license (unless
I am permitted to submit under a different license) that I have identified in
the contribution; or

c. The contribution was provided directly to me by some other person who
represented and warranted (a) or (b) and I have not modified it.

d. I understand and agree that this Project and the contribution are publicly
known and that a record of the contribution (including all personal
information I submit with it, including my sign-off record) is maintained
indefinitely and may be redistributed consistent with this Project or the open
source license(s) involved.
```

This DCO simply certifies that the code you are submitting abides by the clauses stated above. To comply with this agreement, all commits must be signed off with your legal name and email address.

## Logistics

- If you do not have write access to the repo (i.e. not a core contributor), create a fork of Cilantro
- Branches are used to isolate development and ensure clear and concise intent of the code. Always do your work in a branch off the `master` branch. This will be a mirror of the work-in-progres (WIP) branch for the current major version, e.g. `2.x`. Name the branch after the issue and number, e.g. `issue-123`. If there is no issue number, [please create one first](https://github.com/cbmi/cilantro/issues/) before starting your work.
- If working on existing files, ensure the coding style is kept consistent with the code around it. If creating new files or you are unsure of a pattern or preference please consult the [style guides](https://github.com/cbmi/style-guides/).

### JSHint

The repository has a `.jshintrc` file that will enforce certain rules and conventions on the JavaScript source code. Files should not have any JSHint errors warnings when being committed. Most likely [there is a plugin](http://www.jshint.com/install/) you can install for your favorite editor to show errors after each save to the file.

## Modules

The Cilantro codebase is broken up into individual modules using the [Asynchronouse Module Definition (AMD)](https://github.com/amdjs/amdjs-api/wiki/AMD). [RequireJS](http://requirejs.org/) is for it's rich feature set, it's die-hard [author](http://jrburke.com/), and it's powerful optimizer [r.js](https://github.com/jrburke/r.js).

### Module _Aggregator_

Cilantro has the convention of keeping modules small (under ~200 lines) and putting them under their directory. For example, if a module named `views.js` grew too large in size, we follow the pattern:

- Create a directory named after the module, i.e. `views`
- Break up module's contents into separate modules under the directory
- Replace the contents of the module using the following template

```javascript
define([
    'underscore',
    './views/mod1',
    './views/mod2'
], function(_, /* mods... */) {

    // Get the slice of arguments that represent the modules
    // (after underscore)
    var mods = [].slice.call(arguments, 1);

    // Merge the mods into an empty object that will be exported
    return _.extend.apply(_, [{}].concat(mods));
});
```

Whatever each module exports, it will be _aggregated_ into a single object which is representative of the original module's content. This is a transparent change for other modules that depend on the `views` module, but ensures maintainability when a module gets too large.

## Testing

Cilantro tests are written using the Jasmine framework which employs the Behavior Driven Development (BDD) paradigm. Tests live under the `spec/` directory and are defined as AMD modules (like the rest of the codebase; see above). The directory structure of the tests should mimic the structure of the modules under `src/js/cilantro` for consistency. For example:

```
spec/
    router.js       # corresponds to cilantro/router.js
    ui/
        notify.js   # corresponds to cilantro/ui/notify.js
```

A test module has this general structure:

```javascript
define(['cilantro'], function(c) {

    var x;

    // This is used to perform setup prior to a test running such as
    // resetting variables.
    beforeEach(function() {
        x = {};
    });

    // Describe a set of behaviors that are expected
    describe('Some functionality', function() {

        // Assert some behavior
        it('should do this', function() {
            expect(1).toEqual(1);
        });

    });

});
```

### Live Server

Some tests requires a live server of the OpenMRS Harvest demo running at `http://localhost:8000`. To install and setup the demo (only needed once) simply do:

```
virtualenv harvest-openmrs-env
cd harvest-openmrs-env
source bin/activate
git clone --branch demo git://github.com/cbmi/harvest-openmrs.git
cd harvest-openmrs
pip install -r requirements.txt
python bin/manage.py runserver
```
