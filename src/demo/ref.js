import React from './lib/react'
import ReactDOM from './lib/react-dom'
// import React from 'react'
// import ReactDOM from 'react-dom'
import './App.css';

function FunctionComponent(props, ref) {
  return <input {...props} ref={ref}/>
}

class ClassComponent extends React.Component {

}
const FunctionComponentRef = React.forwardRef(FunctionComponent)
class ClassComponent1 extends React.Component {
  ref = React.createRef()
  handleClick = () => {
    console.log(this.ref)
    this.ref.current.focus()
  }
  render = () => {
    return <div>
      <FunctionComponentRef ref={this.ref}/>
      <button onClick={this.handleClick}>click</button>
    </div>
  }
}
class ClassComponent2 extends React.Component {

}
let element = <ClassComponent1 />

ReactDOM.render(element, document.getElementById('root'))
