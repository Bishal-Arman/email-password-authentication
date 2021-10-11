
import { useState } from 'react/cjs/react.development';
import './App.css';
import initializeAuthentication from './Firebase/Firebase.init';
import { getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword,sendEmailVerification ,sendPasswordResetEmail,updateProfile} from "firebase/auth";

initializeAuthentication();


function App() {
  const [name,setName]=useState('')
  const[email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [error,setError]=useState('')
  const [isLogin,setIsLogin]=useState(false)

  const auth = getAuth();
 const handleNameChange=e=>{
   setName(e.target.value)
 }
  const handleEmailChange=e=>{
    setEmail(e.target.value);
  }
  const handlePasswordChange=e=>{
    setPassword(e.target.value);
  }

  const handleRegistration=e=>{
    console.log(email,password)
    e.preventDefault();
    if(password.length<6){
      setError('password should be at least 6 character long')
      return;
    }
   if(!/(?=.{8,})/.test(password)){
     setError('password should contain at least one digit')
     return;
   }

  isLogin ? processLogin (email,password) :registerNewUser(email,password);
   
  }

  const processLogin=(email,password)=>{
        signInWithEmailAndPassword(auth,email,password)
        .then(result=>{
          const user=result.user;
          console.log(user)
          setError('')
        })
        .catch(error=>{
          setError(error.message)
        })
  }
  
  const registerNewUser=(email,password)=>{
    createUserWithEmailAndPassword(auth, email, password)
    .then(result=>{
      const user=result.user;
      console.log(user)
      setError('')
      verifyEmail();
      setUserName()
    })
    .catch(error=>{
      setError(error.message)
    })
  }

  const setUserName=()=>{
    updateProfile(auth.currentUser,{displayName:name})
    .then(result=>{})
  }
  
  const verifyEmail=()=>{
    sendEmailVerification(auth.currentUser)
  .then( result => {
    console.log(result)
  });
  }

  const handleResetPassword=()=>{
    alert('check your mail')
    sendPasswordResetEmail(auth, email)
    .then(() => {
      // Password reset email sent!
      // ..
    })
  }




const toggleLogin=e=>{
  setIsLogin(e.target.checked)
}

  return (
    <div className="mx-5 mt-5">
     <form onSubmit={handleRegistration}>
       <h3 className='text-primary'>Please {isLogin ? 'Login' :' Register'}</h3>
{ ! isLogin &&
       <div className="form-group row">
    <label htmlFor="inputName" className="col-sm-2 col-form-label ">Name</label>
    <div className="col-sm-10">
      <input type="text" onBlur={handleNameChange} className="form-control" id="inputName" placeholder="your name"  required/>
    </div>
  </div>}

  <div className="form-group row">
    <label htmlFor="inputEmail3" className="col-sm-2 col-form-label ">Email</label>
    <div className="col-sm-10">
      <input type="email" onBlur={handleEmailChange} className="form-control" id="inputEmail3" placeholder="Email"  required/>
    </div>
  </div>
  <div className="form-group row">
    <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Password</label>
    <div className="col-sm-10">
      <input type="password" onBlur={handlePasswordChange} className="form-control" id="inputPassword3" placeholder="Password" required/>
    </div>
  </div>
  <div className="form-group row">
    <div className="col-sm-2">Checkbox</div>
    <div className="col-sm-10">
      <div className="form-check">
        <input className="form-check-input" onChange={toggleLogin} type="checkbox" id="gridCheck1"/>
        <label className="form-check-label"  htmlFor="gridCheck1">
          Already Registered?
        </label>
      </div>
    </div>
  </div>
  <div className="col-sm-10 text-danger">{error}</div>
 
  
  <div className="form-group row">
    <div className="col-sm-10">
      <button type="submit" className="btn btn-primary" >{isLogin ? 'Login' : 'Register'}</button>
    </div>
  </div>
  <button type="button" onClick={handleResetPassword} className="btn btn-secondary btn-sm">Reset password</button>
</form>
  
    </div>
  );
}

export default App;
