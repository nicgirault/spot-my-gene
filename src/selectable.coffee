# D3 Selectable
#
# Bind selection functionality to `ul`, an ancestor node selection
# with its corresponding child selection 'li'.
# Selection state update rendering takes place in the `update` callback.
#
# (c) 2012 Johannes J. Schmidt, TF

d3.selectable = (ul, li, update) ->
  lastDecision = undefined

  isParentNode = (parentNode, node) ->
    if !node
      return false
    if node == parentNode
      return true
    isParentNode parentNode, node.parentNode

  selectFirst = (selection) ->
    selection.each (d, i) ->
      if i == 0
        d._selected = true

  selectLast = (selection) ->
    selection.each (d, i, j) ->
      if i == selection[j].length - 1
        d._selected = true

  select = (d, node) ->
    parentNode = ul.filter(->
      isParentNode this, node
    ).node()
    lis = li.filter(->
      isParentNode parentNode, this
    )

    # select ranges via `shift` key
    if d3.event.shiftKey
      firstSelectedIndex = undefined
      lastSelectedIndex = undefined
      currentIndex = undefined
      lis.each (dl, i) ->
        if dl._selected
          firstSelectedIndex or (firstSelectedIndex = i)
          lastSelectedIndex = i
        if this == node
          currentIndex = i
        return
      min = Math.min(firstSelectedIndex, lastSelectedIndex, currentIndex)
      max = Math.max(firstSelectedIndex, lastSelectedIndex, currentIndex)
      # select all between first and last selected
      # when clicked inside a selection
      lis.each (d, i) ->
        # preserve state for additive selection
        d._selected = d3.event.ctrlKey and d._selected or i >= min and i <= max
        return
    else
      # additive select with `ctrl` key
      if !d3.event.ctrlKey
        lis.each (d) ->
          d._selected = false
          return
      d._selected = !d._selected
    # remember decision
    lastDecision = d._selected
    update()
    return

  li.on 'mousedown.selectable', (d) ->
    select d, this
    return
  li.on 'mouseover.selectable', (d) ->
    # dragging over items toggles selection
    if d3.event.which
      d._selected = lastDecision
      update()
    return
  keyCodes =
    up: 38
    down: 40
    home: 36
    end: 35
    a: 65
  ul.on 'keydown.selectable', ->
    if d3.values(keyCodes).indexOf(d3.event.keyCode) == -1
      return
    if d3.event.keyCode == keyCodes.a and !d3.event.ctrlKey
      return
    focus = ul.filter(':focus').node()
    if !focus
      return
    d3.event.preventDefault()
    scope = li.filter((d) ->
      isParentNode focus, this
    )
    selecteds = scope.select((d) ->
      d._selected
    )
    if !d3.event.ctrlKey
      scope.each (d) ->
        d._selected = false
        return
    madeSelection = false
    switch d3.event.keyCode
      when keyCodes.up
        selecteds.each (d, i, j) ->
          if scope[j][i - 1]
            madeSelection = d3.select(scope[j][i - 1]).data()[0]._selected = true
          return
        if !madeSelection
          selectLast scope
      when keyCodes.down
        selecteds.each (d, i, j) ->
          if scope[j][i + 1]
            madeSelection = d3.select(scope[j][i + 1]).data()[0]._selected = true
          return
        if !madeSelection
          selectFirst scope
      when keyCodes.home
        selectFirst scope
      when keyCodes.end
        selectLast scope
      when keyCodes.a
        scope.each (d) ->
          d._selected = !d3.event.shiftKey
          return
    update()
    return
  return
