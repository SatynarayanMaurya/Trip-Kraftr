import React from 'react'
import { useNavigate } from 'react-router-dom'

function SamplePackages() {
    const navigate = useNavigate()
  return (
    <div>SamplePackages
        <button onClick={()=>navigate("add-sample-package")}>Add Package</button>
    </div>
  )
}

export default SamplePackages