let exports = {};

function weekSep(data)
{
    var maxI = data.classes.length
    var weekOne = [], weekTwo = []
    for (let i = 0; i < maxI; i++)
    {
        if (data.classes[i].week == 1)
        {
        weekOne.push(data.classes[i])
        }
        else
        {
        weekTwo.push(data.classes[i])
        }
    }
    return [weekOne, weekTwo]
}

function classMerge(data)
{
    var maxI = data.length
    var newData = []
    for (let i = 0; i < maxI; i++)
    {
        if (i == 0 || data[i].day != data[i - 1].day)
        {
        let tempClass = Object.assign({}, data[i])
        delete tempClass.day
        delete tempClass.week

        newData.push({"day": data[i].day, "classes": [tempClass]})
        }
        else if (data[i].day == data[i - 1].day)
        {
        let tempClass = Object.assign({}, data[i])
        delete tempClass.day
        delete tempClass.week

        newData[newData.length - 1].classes.push(tempClass)
        }
    } 
    return newData
}

function getRidOfEmptyClasses(weeks)
{
    for (var week of weeks)
    {
        for (let g in week)
        { 
            var k = 0
            var weekCopy = [...week[g].classes]
            for(let i of week[g].classes)
            {
            if(i.discipline === '-'  && i.lecturer === '-'  && i.auditorium === '-' )
            {
                weekCopy.splice(k, 1) 
            }
            else
            {
                k++
            }
            }
            week[g].classes = [...weekCopy]
        }
    }
    return weeks
}

function standart(data, sort)
{
    for(let week of data)
    {
        for (let i = 0; i < week.length; i++)
        {
            for (let g = 0; g < week[i].classes.length; g++)
            {
                for (let z = 0; z < sort.length; z++)
                {
                    if (sort[z] == 'groups')
                    {
                        week[i].classes[g][sort[z]] = week[i].classes[g][sort[z]].split(',')
                    }
                    else if (sort[z] == 'lecturer')
                    {
                        week[i].classes[g][sort[z]] = week[i].classes[g][sort[z]].split(', ')
                    }
                    else if (sort[z] == 'auditorium')
                    {
                        week[i].classes[g][sort[z]] = week[i].classes[g][sort[z]].split(', ')
                    }
                }
                week[i].classes[g] = {"firstRow": week[i].classes[g][sort[0]], "secondRow":  week[i].classes[g][sort[1]], "thirdRow":  week[i].classes[g][sort[2]], "class": week[i].classes[g].class, "type": week[i].classes[g].type}
            }
        }
    }
    return data
}

exports.func = (data, sort) =>
{
    var [weekOne, weekTwo] = weekSep(data)
    weekOne = classMerge(weekOne)
    weekTwo = classMerge(weekTwo)
    var weeks = [weekOne, weekTwo]
    weeks = getRidOfEmptyClasses(weeks)
    weeks = standart(weeks, sort)
    return weeks
    
}


export default exports;