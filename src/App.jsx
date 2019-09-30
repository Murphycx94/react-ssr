import React from 'react'
import { Route, Link } from "react-router-dom"
import Temp from './pages/temp'
import Detail from './pages/detail'
import User from './pages/user'


export default class App extends React.Component {

  componentDidMount () {
    console.log('mounted')
  }
  
  render () {
    return (
      <div>
        <Link to="/">主页</Link>
        <Link to="/user">用户</Link>
        <Link to="/detail">用户</Link>
        <Route path="/" exact component={Temp}></Route>
        <Route path="/user" component={User}></Route>
        <Route path="/detail" component={Detail}></Route>
      </div>
    )
  }
}