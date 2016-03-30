describe 'SpotMyGene.Labels', ->

  describe 'constructor', ->
    it 'should initialize properties', ->
      container = 1
      params = 2
      labels = new d3.SpotMyGene.Labels(container, params)

      expect(labels).toEqual jasmine.any Object
      expect(labels.container).toEqual 1
      expect(labels.params).toEqual 2

  describe '_render', ->
    labels = null
    resizeSpy = null
    container = d3.select('body').append 'svg'
    beforeEach ->
      labels = new d3.SpotMyGene.Labels(
        container,
        fontSize: 10
      )
      resizeSpy = sinon
        .stub d3.SpotMyGene, '_labelResize'

    afterEach ->
       d3.SpotMyGene._labelResize.restore()

    it 'should return a selection with data of the same length than items', ->
      selection = labels._render [{id: 1}, {id: 2}]
      expect(selection.data().length).toEqual 2

    it 'should set container font-size', ->
      selection = labels._render [{id: 1}]
      expect(selection.style('font-size')).toEqual '10px'

    it 'should call d3.SpotMyGene._labelResize', ->
      selection = labels._render []
      expect(resizeSpy.calledOnce).toEqual true
      expect(resizeSpy.calledWith(container, fontSize: 10)).toEqual true

  describe 'zoom', ->
    labels = null
    resizeSpy = null
    container = d3.select('body').append 'svg'
    params =
      fontSize: 10
      step: 30
      translate: [12, 0]
    beforeEach ->
      labels = new d3.SpotMyGene.Labels container, params
      resizeSpy = sinon.stub d3.SpotMyGene, '_labelResize'

    afterEach ->
       d3.SpotMyGene._labelResize.restore()

    it 'should call d3.SpotMyGene._labelResize considering zoom arguments', ->
      selection = labels.zoom 1.5, [20, 25]

      expectedParams =
        fontSize: 10
        step: 30 * 1.5
        translate: [20, 25]
      expect(resizeSpy.calledOnce).toEqual true
      expect(resizeSpy.calledWith(container, expectedParams)).toEqual true

    it 'should use initial step when called several times', ->
      selection = labels.zoom 1.5, [20, 25]
      selection = labels.zoom 2, [20, 25]

      expectedParams =
        fontSize: 10
        step: 30 * 2
        translate: [20, 25]
      expect(resizeSpy.calledTwice).toEqual true
      expect(resizeSpy.secondCall.calledWith(container, expectedParams)).toEqual true
