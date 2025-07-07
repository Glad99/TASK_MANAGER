import React from 'react'
import { Outlet } from 'react-router-dom'

const PrivateRoute = ({ allowedRoles }) => {
  return <outlet/>
}

export default PrivateRoute
