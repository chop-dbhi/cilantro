define ->

    linearReg = (xyr, xOptions, yOptions) ->
        l = xyr.length
        sumx = 0
        sumy = 0
        sumx2 = 0
        sumy2 = 0
        sumxy = 0
        sumr = 0
        xfreq = {}
        yfreq = {}
        i = 0

        for point in xyr
            x = point[0]
            y = point[1]
            r = point[2] or 1

            unless xmin?
                xmin = x
                xmax = x
                ymin = y
                ymax = y
            else
                xmin = Math.min(xmin, x)
                xmax = Math.max(xmax, x)
                ymin = Math.min(ymin, y)
                ymax = Math.max(ymax, y)

            xfreq[x] = 0    unless xfreq[x]
            yfreq[y] = 0    unless yfreq[y]
            xfreq[x]++
            yfreq[y]++

            unless xmode?
                xmode = x
                ymode = y
            else
                xmode = x    if xfreq[x] > xfreq[xmode]
                ymode = y    if yfreq[y] > yfreq[ymode]

            sumr += r
            sumx += r * x
            sumx2 += r * (x * x)
            sumy += r * y
            sumy2 += r * (y * y)
            sumxy += r * (x * y)

        offset = (sumy * sumx2 - sumx * sumxy) / (sumr * sumx2 - sumx * sumx)
        slope = (sumr * sumxy - sumx * sumy) / (sumr * sumx2 - sumx * sumx)

        {
            slope: slope
            offset: offset
            x:
                min: xmin
                max: xmax
                line: [ [ xmin, slope * xmin + offset ], [ xmax, slope * xmax + offset ] ]
                mode: xmode
                modePoint: [ xmode, slope * xmode + offset ]

            y:
                min: ymin
                max: ymax
                line: [ [ (ymin - offset) / slope, ymin ], [ (ymax - offset) / slope, ymax ] ]
                mode: ymode
                modePoint: [ (ymode - offset) / slope, ymode ]
        }
