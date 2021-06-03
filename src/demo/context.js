import React from './lib/react'
import ReactDOM from './lib/react-dom'
// import React, { createRef } from 'react'
// import ReactDOM from 'react-dom'
let themeContext = React.createContext()
let {Provider, Consumer } = themeContext
// class Header extends React.Component {
//   static contextType = themeContext

//   render() {
//     console.log(this.context)
//     return <div style={{margin: `5px`, border: `5px solid ${this.context.color}`}}>
//       头部
//       <Title />
//     </div>
//   }
// }
function Header() {
  return <Consumer>
    {
      value => {
        return <div style={{margin: `5px`, border: `5px solid ${value.color}`}}>
          头部
          <Title />
        </div>
      }
    }
  </Consumer>
}
class Title extends React.Component {
  static contextType = themeContext
  render() {
    return <div style={{margin: `5px`, border: `5px solid ${this.context.color}`}}>
       标题
    </div>
  }
}
class Main extends React.Component {
  static contextType = themeContext
  render() {
    return <div style={{margin: `5px`, border: `5px solid ${this.context.color}`}}>
      Main
      <button onClick={() => this.context.changeColor('red')}>红</button>
      <button onClick={() => this.context.changeColor('green')}>绿</button>
    </div>
  }
}
class Page extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      color: 'red'
    }
  }
  componentDidUpdate() {
    console.log('componentDidUpdate11111')
  }
  changeColor = (color) => {
    this.setState({color})
  }
  render() {
    let value = {
      color: this.state.color,
      changeColor: this.changeColor
    }
    return <Provider value={value}>
      <div style={{border: `1px solid ${this.state.color}`}}>
        主页
        <Header />
        <Main />
      </div>
    </Provider>
  }

}
class Container extends React.Component {
  constructor() {
    super()
  }
  componentDidUpdate() {
    console.log('componentDidUpdate')
  }
  render() {
    return <div>
      <Page />
    </div>
  }
}

let element = <Container/>

ReactDOM.render(element, document.getElementById('root'))
