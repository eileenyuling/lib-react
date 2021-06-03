import React from './lib/react'
import ReactDOM from './lib/react-dom'
// import React, { createRef } from 'react'
// import ReactDOM from 'react-dom'
const widthConsole = (Comp) => {
  return class extends React.Component {
    click = (flag) => {
      console.log(flag)
    }
    render() {
      return <Comp click={this.click}/>
    }
  }

}
class Panel extends React.Component {
  constructor(props) {
    super(props)
  }
  render () {
    return <div>
      <button onClick={() => this.props.click(true)}>show</button>
      <button onClick={() => this.props.click(false)}>hide</button>
    </div>
  }
}
const A = widthConsole(Panel)
let element = <A/>

ReactDOM.render(element, document.getElementById('root'))