import React from './lib/react'
import ReactDOM from './lib/react-dom'
// import React from 'react'
// import ReactDOM from 'react-dom'

function Sub(props, ref) {
  console.log(ref)
  let ref2 = React.useRef()
  React.useImperativeHandle(ref, () => {
    return {
      focus(){
        ref2.current.focus()
      }
    }
  })
  return <div>
    <button onClick={props.handleClick}>plus</button>
    <span>{props.data.age}</span>
    <input ref={ref2}/>
  </div>
}
let Reducer = (state, action) => {
  switch(action.type) {
    case 'SET':
      return {name: action.value}
  }
}
let Context = React.createContext()
let ForwardSub = React.forwardRef(Sub)
let MemoSub = React.memo(ForwardSub)

function Counter() {
  let [age, setAge] = React.useState(0)
  let ref = React.useRef()

  let handleClick = () => {
    ref.current.focus()
    console.log(ref.current)
    setAge(age + 1)
  }

  // React.useEffect(() => {
  //   let timer = setTimeout(() => {
  //     handleClick()
  //   }, 1000)
  //   return () => {
  //     clearTimeout(timer)
  //   }
  // }, [age])
  let memoData = React.useMemo(() => {
    return {age}
  }, [age])
  // let data = {age}
  let memoCallback = React.useCallback(handleClick, [age])
  let {state, dispatch} = React.useContext(Context)
  return <div>
    <input type="text" value={state.name} onChange={event => dispatch({type: 'SET', value: event.target.value})}/>
    <MemoSub data={memoData} handleClick={memoCallback} ref={ref}/>
    {/* <ForwardSub data={data} handleClick={handleClick} ref={ref}/> */}
  </div>}


function App() {
  let [state, dispatch] = React.useReducer(Reducer, {name: 'name'})
  return <Context.Provider value={{state, dispatch}}>
    <Counter />
  </Context.Provider>
}

let element = <App />

ReactDOM.render(element, document.getElementById('root'))
