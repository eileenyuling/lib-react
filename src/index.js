import React from './lib/react'
import ReactDOM from './lib/react-dom'
// import React from 'react'
// import ReactDOM from 'react-dom'
import './App.css';
// let element = <ClassComponent />


class ClassComponent extends React.Component {

  render = () => {
    return <div className="App"><FunctionComponent />1</div>
  }
}
class ClassComponent1 extends React.Component {
  constructor(props) {
    super(props)
  }
  onClick = () => {
    console.log('kkkkk')
  }
  render = () => {
    return <h1 onClick={this.onClick}>111111</h1>
  }
}
class ClassComponent2 extends React.Component {
  constructor(props) {
    super(props)
  }
  state = {number: 0}
  handleClick = () => {
    this.setState({number: this.state.number + 1}, () => {
      console.log('callback', this.state.number )
    })
    console.log(this.state.number )
    this.setState({number: this.state.number + 1}, () => {
      console.log('callback', this.state.number )
    })
    console.log(this.state.number )
    setTimeout(() => {
      this.setState({number: this.state.number + 1}, () => {
        console.log('callback', this.state.number )
      })
      console.log(this.state.number )
      this.setState({number: this.state.number + 1}, () => {
        console.log('callback', this.state.number )
      })
      console.log(this.state.number )
    }, 0)
  }
  render = () => {
    return <div onClick={this.handleClick}>222222<ClassComponent1 ></ClassComponent1></div>
  }
}
let element = <ClassComponent2 />
function FunctionComponent(props) {
  return <div className="App" onClick={props.onClick}>home</div>
}
// let element = <div>element</div>
ReactDOM.render(element, document.getElementById('root'))
// export default App;
