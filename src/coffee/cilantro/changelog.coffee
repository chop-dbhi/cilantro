# The changelog not only lists the significant changes in the interface,
# but provides a mechanism to hook into the tour or display a help menu.
# The changelog is an array of _version_ objects. Each version has a summary
# and an array of changes. Versions listed in descending order, the array
# can also be accessed by version, e.g. changelog['2.0.0']
define ->

    changelog = [
        version: '2.1.2',
        changes: []
    ,
        version: '2.1.1',
        changes: []
    ,
        version: '2.1.0',
        changes: []
    ,
        version: '2.0.1'
        changes: []
    ,
        version: '2.0.0'
        changes: [
            summary: 'Initial Release'
        ]
    ]

    for release in changelog
        changelog[release.version] = release

    return changelog
