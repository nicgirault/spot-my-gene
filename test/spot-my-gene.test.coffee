describe 'SoptMyGene', ->
  it 'should be defined', ->
      expect(d3.SpotMyGene).to.be.an('object')

  it 'should instantiate a circos object', ->
      expect(c).to.be.an.instanceOf(circosJS.Core)

  it 'should return expected width and height', ->
      expect(c.conf.width).to.equal(499)
      expect(c.conf.height).to.equal(500)

  it 'should return expected container', ->
      expect(c.conf.container).to.equal('#chart')
