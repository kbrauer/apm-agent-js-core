const utils = require('../common/utils')
const BaseSpan = require('./span-base')

class Span extends BaseSpan {
  constructor (name, type, options) {
    super()
    this.id = utils.generateRandomId(16)
    var opts = options || {}
    this.traceId = opts.traceId
    this.sampled = opts.sampled
    if (typeof opts.onSpanEnd === 'function') {
      this.onSpanEnd = opts.onSpanEnd
    } else {
      this.onSpanEnd = function () {}
    }
    this.name = name
    this.type = type
    this.subType = undefined
    this.action = undefined
    if (type.indexOf('.') !== -1) {
      var fields = type.split('.', 3)
      this.type = fields[0]
      this.subType = fields[1]
      this.action = fields[2]
    }
    this.ended = false
    this._end = undefined
    this.context = undefined
    this.sync = opts.sync
    // Start timers
    this._start = window.performance.now()
  }
  end () {
    if (this.ended) {
      return
    }

    this._end = window.performance.now()

    this.ended = true
    this.onSpanEnd(this)
  }

  duration () {
    if (utils.isUndefined(this._end) || utils.isUndefined(this._start)) {
      return null
    }

    var diff = this._end - this._start

    return parseFloat(diff)
  }
}

module.exports = Span
