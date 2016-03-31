describe 'SpotMyGene.SampleLabels', ->

  describe 'constructor', ->
    it 'should initialize properties', ->
      container = d3.select('body').append('svg')
      container.append('g').attr('class', 'sample-labels')
      params = 2
      labels = new d3.SpotMyGene.SampleLabels(params, container)

      expect(labels).toEqual jasmine.any Object
      expect(labels.container.attr('class')).toEqual 'axis'
      expect(labels.params).toEqual params

  describe 'render', ->
    labels = null
    renderSpy = null
    container = d3.select('body').append('svg')
    container.append('g').attr('class', 'sample-labels')

    beforeEach ->
      labels = new d3.SpotMyGene.SampleLabels(
        {}
        container,
      )
      renderSpy = sinon
        .stub labels, '_render'
        .returns container

    afterEach ->
       labels._render.restore()

    it 'should call _render with an array of samples', ->
      labels.render [{id: 1}, {id: 2}]
      expect(renderSpy.calledOnce).toEqual true
      expect(renderSpy.calledWith([{id: 1}, {id: 2}])).toEqual true

    it 'should set text-anchor attribute to "start"', ->
      labels.render [{id: 1}, {id: 2}]
      expect(labels.selection.attr('text-anchor')).toEqual 'start'
