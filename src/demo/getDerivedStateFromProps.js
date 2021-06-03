import React from './lib/react'
import ReactDOM from './lib/react-dom'
// import React from 'react'
// import ReactDOM from 'react-dom'

class ClassComponent1 extends React.Component {
  static defaultProps = {
    name: 'a'
  }
  constructor(props) {
    super(props)
    console.log('1、constructor')
    this.myRef = React.createRef();
    this.state = {
      number: 0,
      inputWidth: {width: '33px'},
      inputValue: '',
      inputValue2: ''
    }
    // this.setState({
    //   a: 1
    // })
  }
  componentWillMount() {
    console.log('2、componentWillMount')
  }
  componentDidMount() {
    console.log('4、componentDidMount')
  }

  shouldComponentUpdate() {
    console.log('5、shouldComponentUpdate')
    return true
  }
  componentWillUpdate() {
    console.log('6、componentWillUpdate')
  }
  componentDidUpdate() {
    console.log('7、componentDidUpdate')
  }
  handleClick = () => {
    this.setState({
      number: this.state.number + 3
    })
    this.setState({
      number: this.state.number + 2
    })
    this.setState({
      number: this.state.number + 1
    })
  }
  change = (e) => {
    this.setState({
      inputValue2: e.target.value
    })
    setTimeout(() => {
      let offsetWidth = this.myRef.current.offsetWidth
      this.setState({
        inputWidth: {width: offsetWidth + 'px'},
        inputValue: this.state.inputValue2
      })
    }, 0)
    // this.setState({
    //   inputValue: e.target.value
    // })
  }
  render = () => {
    console.log('3、render')
    return <div>
      <div>{this.props.name}: {this.state.number}</div>
      <button onClick={this.handleClick}>click</button>
      <Component2 number={this.state.number}/>
      <FunctionComp number={this.state.number}/>
      <input onChange={this.change} value={this.state.inputValue} style={this.state.inputWidth}/>
      <span ref={this.myRef}>{this.state.inputValue2}</span>
      {/* {
        this.state.number % 2 === 0
        ? null
        :
      } */}
    </div>
  }
}
function FunctionComp(props) {
  return <div>{props.number}</div>
}
class Component2 extends React.Component {
  constructor(props) {
    super(props)
    console.log('Component2 1、constructor')
    this.state = {
      number: 0
    }
  }
  componentWillMount() {
    console.log('Component2 2、componentWillMount')
  }
  componentDidMount() {
    console.log('Component2 4、componentDidMount')
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    console.log('getDerivedStateFromProps', nextProps, prevState)
    return {...nextProps, ...prevState}
  }
  shouldComponentUpdate(nextProps, nextState) {
    console.log(nextProps)
    console.log('Component2 5、shouldComponentUpdate')
    return true
  }
  componentWillUpdate() {
    console.log('Component2 6、componentWillUpdate')
  }
  componentDidUpdate() {
    console.log('Component2 7、componentDidUpdate')
  }
  componentWillReceiveProps() {
    console.log('Component2 8、componentWillReceiveProps')
  }
  componentWillUnmount() {
    console.log('Component2 componentWillUnmount')
  }
  render() {
    console.log('Component2 3、render')
    return <div>Component2: {this.props.number + 1}</div>
  }
}
let element = <ClassComponent1/>

ReactDOM.render(element, document.getElementById('root'))
