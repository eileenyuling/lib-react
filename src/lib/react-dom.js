import {
  REACT_TEXT,
  REACT_FORWARD_REF_TYPE,
  REACT_PROVIDER,
  REACT_CONTEXT
} from './contants'
import { addEvent } from './event'
function render(vdom, container) {
  let newDOM = createDOM(vdom)
  container.appendChild(newDOM)
  if (newDOM.componentDidMount) {
    newDOM.componentDidMount()
  }
}

function createDOM(vdom) {
  let { type, props, ref } = vdom
  let dom
  if (type && type.$$typeof === REACT_FORWARD_REF_TYPE) {
    return mountForwardComponent(vdom)
  }
  else if (type && type.$$typeof === REACT_PROVIDER) {
    return mountProviderComponent(vdom)
  }
  else if (type && type.$$typeof === REACT_CONTEXT) {
    return mountContextComponent(vdom)
  }
  else if (type === REACT_TEXT) {
    dom = document.createTextNode(props.content)
  } else if (typeof type === 'function'){
    if (type.isReactComponent) {
      return mountClassComponent(vdom)
    } else {
      return mountFunctionComponent(vdom)
    }
  } else {
    dom = document.createElement(type)
    if (props) {
      updateProps(dom, {}, props)
    }
  }
  if (props) {
    if (typeof props.children === 'object' && props.children.type) {
      render(props.children, dom)
    } else if (Array.isArray(props.children)) {
      reconcileChildren(props.children, dom)
    }
  }
  if (ref) {
    ref.current = dom
  }
  vdom.dom = dom
  return dom
}

function updateProps(dom, oldProps, newProps) {
  for (let key in newProps) {
    if (key === 'children') {
      continue
    }
    if (key === 'style') {
      let styleObj = newProps[key]
      for (let attr in styleObj) {
        dom.style[attr] = styleObj[attr]
      }
    } else if (key.startsWith('on')) {
      addEvent(dom, key.toLocaleLowerCase(), newProps[key])
    } else {
      if (newProps[key] !== null && newProps[key] !== undefined) {
        dom[key] = newProps[key]
      }
    }
  }
}

function reconcileChildren(children, dom) {
  for (let i = 0; i < children.length; i++) {
    render(children[i], dom)
  }
}
function mountProviderComponent(vdom) {
  // type: $$typeof: REACT_PROVIDER,_context: context
  // props: {value, children}
  const { type, props } = vdom
  type._context._currentValue = props.value
  let renderVdom = props.children
  vdom.oldRenderVdom = renderVdom
  return createDOM(renderVdom)
}
function mountContextComponent(vdom) {
  const { type, props } = vdom
  let renderVdom = props.children(type._context._currentValue)
  vdom.oldRenderVdom = renderVdom
  return createDOM(renderVdom)
}
function mountForwardComponent(vdom) {
  const { type, props, ref } = vdom
  let renderVdom = type.render(props, ref)
  vdom.oldRenderVdom = renderVdom
  return createDOM(renderVdom)
}
function mountFunctionComponent(vdom) {
  const { type, props } = vdom
  let renderVdom = type(props)
  vdom.oldRenderVdom = renderVdom
  return createDOM(renderVdom)
}
function mountClassComponent(vdom) {
  const { type, props, ref } = vdom
  if (type.defaultProps) {
    Object.assign(props, type.defaultProps)
  }
  let classInstance = new type(props)
  vdom.classInstance = classInstance
  vdom.props = props
  // lifecycle
  if (classInstance.componentWillMount) {
    classInstance.componentWillMount()
  }
  if (type.getDerivedStateFromProps) {
    classInstance.state = type.getDerivedStateFromProps(props, classInstance.state)
  }
  if (type.contextType) {
    classInstance.context = type.contextType._currentValue
  }
  let renderVdom = classInstance.render()
  classInstance.oldRenderVdom = vdom.oldRenderVdom = renderVdom
  if (ref) {
    ref.current = classInstance
  }
  let dom = createDOM(renderVdom)
  // lifecycle
  if (classInstance.componentDidMount) {
    dom.componentDidMount = classInstance.componentDidMount.bind(classInstance)
  }
  return dom
}

export function findDOM(vdom) {
  const { type } = vdom
  let dom
  if (typeof type === 'string' || type === REACT_TEXT) {
    dom = vdom.dom
  } else {
    dom = findDOM(vdom.oldRenderVdom)

  }
  return dom
}
export function compareTwoVdom(parentDom, oldVdom, newVdom, nextDOM) {
  if (!oldVdom && !newVdom) {
  } else if (oldVdom && !newVdom) {
    let oldDom = findDOM(oldVdom)
    parentDom.removeChild(oldDom)
    if (oldVdom.classInstance && oldVdom.classInstance.componentWillUnmount) {
      oldVdom.classInstance.componentWillUnmount()
    }
  } else if (!oldVdom && newVdom) {
    let newDom = createDOM(newVdom)
    if (nextDOM) {
      parentDom.insertBefore(newDom, nextDOM)
    } else {
      parentDom.appendChild(newDom) // 可能是插入元素，appendChild不妥当
    }
    if (newDom.componentDidMount) {
      newDom.componentDidMount()
    }
  } else if (oldVdom && newVdom && oldVdom.type !== newVdom.type){
    let oldDom = findDOM(oldVdom)
    let newDom = createDOM(newVdom)
    parentDom.replaceChild(newDom, oldDom)
  } else {
    updateElement(oldVdom, newVdom)
  }
}

function updateElement(oldVdom, newVdom) {
  if (typeof oldVdom.type === 'string') {
    let currentDom = newVdom.dom = findDOM(oldVdom)
    // 更新dom属性
    updateProps(currentDom, oldVdom.props, newVdom.props)
    updateChildren(currentDom, oldVdom.props.children, newVdom.props.children)
  } else if (oldVdom.type === REACT_TEXT) {
    let currentDom = newVdom.dom = findDOM(oldVdom)
    if (newVdom.props.content !== oldVdom.props.content) {
      currentDom.textContent = newVdom.props.content
    }
  } else if (oldVdom.type && oldVdom.type.$$typeof === REACT_PROVIDER) {
    updateProviderComponent(oldVdom, newVdom)
  } else if (oldVdom.type && oldVdom.type.$$typeof === REACT_CONTEXT) {
    updateContextComponent(oldVdom, newVdom)
  } else if (typeof oldVdom.type === 'function') { // 类组件或者函数组件
    if (oldVdom.type.isReactComponent) {
      updateClassComponent(oldVdom, newVdom)
    } else {
      updateFunctionComponent(oldVdom, newVdom)
    }
  }
}
function updateProviderComponent(oldVdom, newVdom) {
  let parentDom = findDOM(oldVdom).parentNode
  const { type, props } = newVdom
  type._context._currentValue = props.value
  newVdom.oldRenderVdom = props.children
  compareTwoVdom(parentDom, oldVdom.oldRenderVdom, newVdom.oldRenderVdom)
}
function updateContextComponent(oldVdom, newVdom) {
  let parentDom = findDOM(oldVdom).parentNode
  const { type, props } = newVdom
  newVdom.oldRenderVdom = props.children(type._context._currentValue)
  compareTwoVdom(parentDom, oldVdom.oldRenderVdom, newVdom.oldRenderVdom)
}
function updateClassComponent(oldVdom, newVdom) {
  let classInstance = newVdom.classInstance = oldVdom.classInstance
  newVdom.oldRenderVdom = oldVdom.oldRenderVdom
  if (classInstance.componentWillReceiveProps) {
    classInstance.componentWillReceiveProps(newVdom.props)
  }
  classInstance.updater.emitUpdate(newVdom.props)
}
function updateFunctionComponent(oldVdom, newVdom) {
  let parentDom = findDOM(oldVdom).parentNode
  newVdom.oldRenderVdom = newVdom.type(newVdom.props, newVdom.ref)
  compareTwoVdom(parentDom, oldVdom.oldRenderVdom, newVdom.oldRenderVdom)
}

function updateChildren(parentDom, oldVChildren, newVChildren) {
  oldVChildren = Array.isArray(oldVChildren) ? oldVChildren : [oldVChildren]
  newVChildren = Array.isArray(newVChildren) ? newVChildren : [newVChildren]
  let maxLength = Math.max(oldVChildren.length, newVChildren.length)
  for (let i = 0; i < maxLength; i++) {
    let nextDOM = oldVChildren.find((item, index) => {
      return index > i && item && findDOM(item)
    })
    compareTwoVdom(parentDom, oldVChildren[i], newVChildren[i], nextDOM && findDOM(nextDOM))
  }
}
const ReactDOM = {
  render,
  createDOM,
  findDOM,
  compareTwoVdom
}
export default ReactDOM