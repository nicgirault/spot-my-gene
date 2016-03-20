# function similar to lodash defaultsDeep:
# returns an object of the same shape that defaults with the parameter value
# if defined. Otherwise it fallback on defaults value
d3.SpotMyGene.defaults = (parameters, defaults) ->
  toReturn = {}
  for key, value of defaults
    if key of parameters
      if Object.prototype.toString.call(value) == '[object Array]'
        toReturn[key] = parameters[key]
      else if typeof value == 'object'
        if value? and Object.keys(value).length is 0
          toReturn[key] = parameters[key]
        else
          toReturn[key] = d3.SpotMyGene.defaults parameters[key], value
      else
        toReturn[key] = parameters[key]
    else
      toReturn[key] = value
  return toReturn
