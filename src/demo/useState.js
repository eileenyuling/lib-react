import React from './lib/react'
import ReactDOM from './lib/react-dom'
// import React from 'react'
// import ReactDOM from 'react-dom'
function Sub() {
  let [number, setNumber] = React.useState(0)
  let [number1, setNumber1] = React.useState(1)
  let [number2, setNumber2] = React.useState(2)
  let handleClick = () => {
    setNumber(number + 1)
  }
  let handleClick1 = () => {
    setNumber1(number1 + 1)
  }
  let handleClick2 = () => {
    setNumber2(number2 + 1)
  }
  return <div>
    <button onClick={handleClick}>plus</button>
    <button onClick={handleClick1}>plus1</button>
    <button onClick={handleClick2}>plus2</button>
    <span>{number}</span>
    <span>{number1}</span>
    <span>{number2}</span>
  </div>
}
class MouseTracker extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      x: 0,
      y: 0,
      inputValue: 0
    }
    this.inputRef = React.createRef()
  }

  handleMouseMove = (e) => {
    this.setState({
      x: e.clientX,
      y: e.clientY
    })
  }
  click = () => {
    this.setState({
      inputValue: Number(this.inputRef.current.value) + this.state.inputValue
    })
  }
  render() {
    return <div style={{width: '100%', height: '100vh'}}>
      <input ref={this.inputRef}/>
      <div>{this.state.inputValue}</div>
      <button onClick={this.click}>+</button>
      <Sub />
    </div>
  }
}

let element = <Sub>

</Sub>

ReactDOM.render(element, document.getElementById('root'))
