describe 'SpotMyGene.resizeTree', ->

  it 'should be defined', ->
    expect(d3.SpotMyGene.resizeTree).to.be.a 'function'

  it 'should compute correct values for (x,y)', ->
    data =
      root:
        value: 10
        children: [
          value: 5
          children: [
            x: null
            y: null
          ,
            x: null
            y: null
          ]
        ,
          x: null
          y: null
        ]
      width: 200
      height: 100

    d3.SpotMyGene.resizeTree data.width, data.height, 3, data.root

    testChildren = (node) ->
      expect(node.x).to.be.within(0, data.width)
      expect(node.y).to.be.within(0, data.height)
      if node.children?
        testChildren node.children[0]
        testChildren node.children[1]
