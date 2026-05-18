import {expect} from 'chai'

import Publish from '../../src/commands/publish.js'

describe('publish', () => {
  describe('version selection', () => {
    it('moves down through version options', () => {
      const publish = Object.create(Publish.prototype) as {
        getNextVersionSelectionIndex: (
          currentIndex: number,
          direction: 'down' | 'up',
          optionCount: number,
        ) => number
      }

      expect(publish.getNextVersionSelectionIndex(0, 'down', 3)).to.equal(1)
    })

    it('wraps up from the first version option to the last', () => {
      const publish = Object.create(Publish.prototype) as {
        getNextVersionSelectionIndex: (
          currentIndex: number,
          direction: 'down' | 'up',
          optionCount: number,
        ) => number
      }

      expect(publish.getNextVersionSelectionIndex(0, 'up', 3)).to.equal(2)
    })
  })
})
