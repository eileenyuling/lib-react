import { wrapToVdom, shawllowEqual } from './utils'
import {
  findDOM,
  compareTwoVdom,
  useState,
  useMemo,
  useCallback,
  useReducer,
  useEffect,
  useLayoutEffect,
  useRef } from './react-dom'
import {
  REACT_FORWARD_REF_TYPE,
  REACT_CONTEXT,
  REACT_PROVIDER,
  REACT_MEMO } from './contants'
function createElement(type, config, children) {
  let ref
  let key
  if (config) {
    ref = config.ref
    key = config.key
    delete config.ref
    delete config.key
    delete config.__self
    delete config.__source
  }
  let props = {...config}
  if (arguments.length > 3) {
    children = Array.prototype.slice.call(arguments, 2).map(wrapToVdom)
  }
  if (children !== undefined) {
    props.children = wrapToVdom(children)
  }
  return {
    type,
    props,
    ref,
    key
  }
}

function cloneElement(oldElement, newProps, children) {
  if (arguments.length > 3) {
    children = Array.prototype.slice.call(arguments, 2).map(wrapToVdom)
  }
  if (children !== null && children !== undefined) {
    children = wrapToVdom(children)
  }
  let props = {...oldElement.props, ...newProps, children}
  return {...oldElement, props}
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
  emitUpdate(nextProps) {
    this.nextProps = nextProps
    if (updateQueue.isBatchingUpdate) {
      updateQueue.updaters.push(this)
    } else {
      this.updateComponent()
    }
  }
  updateComponent() {
    let { classInstance, pendingStates, nextProps } = this
    if (nextProps || pendingStates.length > 0) {
      shouldUpdate(classInstance, nextProps, this.getState())
      this.callbacks.forEach(callback => callback())
      this.callbacks.length = 0
    }
  }
}
function shouldUpdate(classInstance, nextProps, nextState) {
  let willUpdate = true
  if (classInstance.shouldComponentUpdate
    && !classInstance.shouldComponentUpdate(nextProps, nextState)) {
      willUpdate = false
  }
  if (willUpdate && classInstance.componentWillUpdate) {
    classInstance.componentWillUpdate()
  }
  if (nextProps) {
    classInstance.props = nextProps
  }
  if (classInstance.constructor.getDerivedStateFromProps) {
    nextState = classInstance.constructor.getDerivedStateFromProps(nextProps, classInstance.state)
  }
  classInstance.state = nextState
  if (willUpdate) {
    classInstance.forceUpdate()
  }
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
    if (this.constructor.contextType) {
      this.context = this.constructor.contextType._currentValue
    }
    let oldRenderVdom = this.oldRenderVdom
    let newRenderVdom = this.render()
    let oldDom = findDOM(oldRenderVdom)
    let extraArgs = {}
    if (this.getSnapshotBeforeUpdate) {
      extraArgs = this.getSnapshotBeforeUpdate()
    }
    compareTwoVdom(oldDom.parentNode, oldRenderVdom, newRenderVdom)
    this.oldRenderVdom = newRenderVdom
    if (this.componentDidUpdate) {
      this.componentDidUpdate(this.props, this.state, extraArgs)
    }
  }
}

class PureComponent extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return (!shawllowEqual(nextProps, this.props) || !shawllowEqual(nextState, this.state))
  }
}

function createRef() {
  return {
    current: null
  }
}

function forwardRef(render) {
  return {
    $$typeof: REACT_FORWARD_REF_TYPE,
    render
  }
}
// function createContext() {
//   const context = {Provider, Consumer}
//   function Provider({value, children}){
//     context._value = value
//     return children
//   }
//   function Consumer({children}) {
//     return children(context._value)
//   }
//   return context
// }
function createContext() {
  let context = {
    $$typeof: REACT_CONTEXT
  }
  context.Provider = {
    $$typeof: REACT_PROVIDER,
    _context: context
  }
  context.Consumer = {
    $$typeof: REACT_CONTEXT,
    _context: context
  }
  return context
}
function memo(type, compare=shawllowEqual) {
  return {
    $$typeof: REACT_MEMO,
    type,
    compare
  }
}

function useContext(context) {
  return context._currentValue
}

function useImperativeHandle(ref, factory, deps) {
  ref.current = factory()
}
const React = {
  createElement,
  Component,
  PureComponent,
  createRef,
  forwardRef,
  createContext,
  cloneElement,
  memo,
  useState,
  useMemo,
  useCallback,
  useReducer,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useImperativeHandle
}
export default React