Build
=====
Coriander contains a built non-Rails version of [Bourbon][] via
the instructions per the project's README. It ships with additional
sass extensions written in Ruby, thus the compilation step must reference
the additional library:

```bash
sass --watch --scss path/to/scss:path/to/css -r path/to/bourbon/lib/bourbon.rb
```

[Bourbon]: https://github.com/thoughtbot/bourbon
