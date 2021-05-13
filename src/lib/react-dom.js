import { REACT_TEXT } from './contants'
import { addEvent } from './event'
function render(vdom, container) {
  let newDOM = createDOM(vdom)
  container.appendChild(newDOM)
}

function createDOM(vdom) {
  let { type, props } = vdom
  let dom
  if (type === REACT_TEXT) {
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
      // dom[key.toLocaleLowerCase()] = newProps[key]
      addEvent(dom, key.toLocaleLowerCase(), newProps[key])
    } else {
      dom[key] = newProps[key]
    }
  }
}

function reconcileChildren(children, dom) {
  for (let i = 0; i < children.length; i++) {
    render(children[i], dom)
  }
}

function mountFunctionComponent(vdom) {
  const { type, props } = vdom
  let renderVdom = type(props)
  vdom.oldRenderVdom = renderVdom
  return createDOM(renderVdom)
}
function mountClassComponent(vdom) {
  const { type, props } = vdom
  let classInstance = new type(props)
  let renderVdom = classInstance.render()
  classInstance.oldRenderVdom = vdom.oldRenderVdom = renderVdom
  return createDOM(renderVdom)
}

export function findDOM(vdom) {
  const { type } = vdom
  let dom
  if (typeof type === 'function') {
    dom = findDOM(vdom.oldRenderVdom)
  } else {
    dom = vdom.dom
  }
  return dom
}
export function compareTwoVdom(parentDom, oldDom, newVdom) {
  // let oldDom = findDOM(oldVdom)
  let newDom = createDOM(newVdom)
  parentDom.replaceChild(newDom, oldDom)
}

const ReactDOM = {
  render,
  createDOM,
  findDOM,
  compareTwoVdom
}
export default ReactDOM