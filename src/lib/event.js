import { updateQueue } from './react'
export function addEvent(dom, eventType, handler) {
  let store
  if (dom.store) {
    store = dom.store
  } else {
    dom.store = store = {}
  }
  store[eventType] = handler
  if (!document[eventType]) {
    document[eventType] = dispatchEvent
  }
}

function dispatchEvent(event) {
  let { target, type } = event
  let eventType = `on${type}`
  updateQueue.isBatchingUpdate = true
  let syntheticEvent = createSyntheticEvent(event)
  // 事件冒泡
  while(target) {
    let { store } = target
    let handler = store && store[eventType]
    handler && handler.call(target, syntheticEvent)
    target = target.parentNode
  }
  updateQueue.isBatchingUpdate = false
  updateQueue.batchUpdate()
}

function createSyntheticEvent(event) {
  let syntheticEvent = {}
  for (let key in event) {
    syntheticEvent[key] = event[key]
  }
  return syntheticEvent
}