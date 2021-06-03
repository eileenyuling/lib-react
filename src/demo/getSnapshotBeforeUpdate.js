import React from './lib/react'
import ReactDOM from './lib/react-dom'
// import React, { createRef } from 'react'
// import ReactDOM from 'react-dom'

class ClassComponent1 extends React.Component {
  static defaultProps = {
    name: 'a'
  }
  constructor(props) {
    super(props)
    console.log('1、constructor')
    this.myRef = React.createRef();
    this.wrapper = React.createRef()
    this.state = {
      messages: []
    }
  }
  componentWillMount() {
    console.log('2、componentWillMount')
  }
  componentDidMount() {
    console.log('4、componentDidMount')

    this.timer = setInterval(() => {
      if (this.state.messages.length === 20) {
        clearInterval(this.timer)
        return
      }
      this.setState((state) => {
        return {messages: [state.messages.length, ...state.messages]}
      })
    }, 1000);
  }
  getSnapshotBeforeUpdate() {
    console.log(this.wrapper)
    return {
      prevScrollTop: this.wrapper.current.scrollTop,
      prevScrollHeight: this.wrapper.current.scrollHeight
    }
  }
  shouldComponentUpdate() {
    console.log('5、shouldComponentUpdate')
    return true
  }
  componentWillUpdate() {
    console.log('6、componentWillUpdate')
  }
  componentDidUpdate(prevProps, prevState, {prevScrollTop, prevScrollHeight}) {
    console.log(prevScrollTop, prevScrollHeight)
    this.wrapper.current.scrollTop = prevScrollTop + this.wrapper.current.scrollHeight - prevScrollHeight
    console.log('7、componentDidUpdate')
  }
  render = () => {
    console.log('3、render')
    const style = {
      height: '100px',
      width: '100px',
      border: '1px solid #000',
      overflow: 'scroll'
    }
    return <div style={style} ref={this.wrapper}>
      {this.state.messages.map(message => {
        return <div>{ message }</div>
      })}
    </div>
  }
}
let element = <ClassComponent1/>

ReactDOM.render(element, document.getElementById('root'))
