import { wrapToVdom } from './utils'
import { findDOM, compareTwoVdom } from './react-dom'
function createElement(type, config, children) {
  let props = {...config}
  if (arguments.length > 3) {
    children = Array.prototype.slice.call(arguments, 2).map(wrapToVdom)
  }
  props.children = wrapToVdom(children)
  return {
    type,
    props
  }
}
export let updateQueue = {
  isBatchingUpdate: false,
  updaters: [],
  batchUpdate() {
    for (let updater of updateQueue.updaters) {
      updater.updateComponent()
    }
    updateQueue.isBatchingUpdate = false
    updateQueue.updaters.length = 0
  }
}
class Updater {
  constructor(classInstance) {
    this.classInstance = classInstance
    this.pendingStates = []
    this.callbacks = []
  }
  addState(partialState, callback) {
    this.pendingStates.push(partialState)
    if (typeof callback === 'function') {
      this.callbacks.push(callback)
    }
    this.emitUpdate()
  }
  getState() { // 根据老状态和更新队列， 计算新状态
    let { classInstance, pendingStates } = this
    let { state } = classInstance
    let newState = {}
    pendingStates.forEach(nextState => {
      if (typeof nextState === 'function') {
        nextState = nextState(state)
      }
      newState = {...state, ...nextState}
    })
    pendingStates.length = 0
    return newState
  }
  emitUpdate() {
    if (updateQueue.isBatchingUpdate) {
      updateQueue.updaters.push(this)
    } else {
      this.updateComponent()
    }
  }
  updateComponent() {
    let { classInstance, pendingStates } = this
    if (pendingStates.length > 0) {
      shouldUpdate(classInstance, this.getState())
      this.callbacks.forEach(callback => callback())
      this.callbacks.length = 0
    }
  }
}
function shouldUpdate(classInstance, nextState) {
  classInstance.state = nextState
  classInstance.forceUpdate()
}
class Component {
  static isReactComponent = {}
  constructor(props) {
    this.props = props
    this.state = {}
    this.updater = new Updater(this)
  }
  setState(partialState, callback) {
    this.updater.addState(partialState, callback)
  }
  // 先获取老的虚拟dom
  // 再获取新的虚拟dom
  // 进行比较
  forceUpdate() {
    let oldRenderVdom = this.oldRenderVdom
    let newRenderVdom = this.render()
    let oldDom = findDOM(oldRenderVdom)
    compareTwoVdom(oldDom.parentNode, oldDom, newRenderVdom)
    this.oldRenderVdom = newRenderVdom
  }
}
const React = {
  createElement,
  Component
}
export default React