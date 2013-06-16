# The changelog not only lists the significant changes in the interface,
# but provides a mechanism to hook into the tour or display a help menu.
# The changelog is an array of _version_ objects. Each version has a summary
# and an array of changes.
define ->

    return [
        version: '2.0.0'
        changes: [
            summary: 'Initial Release'
        ]
    ]
