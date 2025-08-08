import React from 'react'
import AuthLayout from '../../assets/components/layouts/AuthLayout'

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminInviteToken, setAdminInviteToken] = useState("");
  const [error, setError] = useState(null);


  return (
    <AuthLayout>
      <div className="lg:w-"></div>
    </AuthLayout>
  )
}

export default SignUp
