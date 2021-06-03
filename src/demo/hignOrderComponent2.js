import React from './lib/react'
import ReactDOM from './lib/react-dom'
// import React, { createRef } from 'react'
// import ReactDOM from 'react-dom'
class DesignButton extends React.Component {
  state = {name: 'zhangsan'}
  componentWillMount() {
    console.log('DesignButton componentWillMount')
  }
  componentDidMount() {
    console.log('DesignButton componentDidMount')
  }
  render() {
    return <button name={this.state.name}>{this.props.title}</button>
  }
}

const Wrapper = (Comp) => {
  return class extends Comp {
    constructor(props) {
      super(props)
      this.state ={...this.state, number: 0}
    }
    componentWillMount() {
      console.log('Wrapper componentWillMount')
      // super.componentWillMount()
    }
    componentDidMount() {
      console.log('Wrapper componentDidMount')
      // super.componentDidMount()
    }
    click = () => {
      this.setState({
        number: this.state.number + 1
      })
    }
    render() {
      let ele = super.render()
      let newProps = {
        ...ele.props,
        onClick: this.click
      }
      let cloneEle = React.cloneElement(ele, newProps, this.state.number)
      return cloneEle
    }
  }
}
const A = Wrapper(DesignButton)
let element = <A title="title"/>

ReactDOM.render(element, document.getElementById('root'))