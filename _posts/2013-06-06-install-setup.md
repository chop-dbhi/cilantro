---
layout: page
title: "Download & Setup"
category: ref
date: "2013-06-06 16:36:26"
published: true
---

## Download

Stable releases are available on the [releases](https://github.com/cbmi/cilantro/releases) page. Download either non-source package and unarchive it to produce a folder named `cilantro/`.

## Setup

Create an HTML file next to the `cilantro/` folder.

```html
<!doctype html>
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <meta name="viewport" content="width=device-width">
        <title>Hello Cilantro!</title>
        <link rel=stylesheet href="/cilantro/css/style.css">
    </head>
    <body>
        <div id="main"></div>
        <script>
        	// Pre-configuration of requirejs and cilantro
        	var require = {
            		baseUrl: '/cilantro/js'
            	},
            	cilantro = {
					// The Serrano-compatible API endpoint Cilantro
                    // will talk to
    				url: '/api/',
    				// Tells cilantro where to render the app, defaults
                    // to #cilantro-main if not specified
			    	main: '#main'
                }
             };
        </script>
        <script data-main="cilantro/main" src="/cilantro/js/require.js"></script>
    </body>
</html>
```

The require.js script tag right before the closing `</body>` tag. Set the [`data-main` attribute](http://requirejs.org/docs/api.html#jsfiles) to load main module supplied with Cilantro.