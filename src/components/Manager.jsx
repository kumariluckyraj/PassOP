import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const Manager = () => {
  const ref = useRef();
  const [form, setForm] = useState({ site: "", username: "", password: "" });
  const [showPass, setShowPass] = useState(false); // State to track password visibility
  const [passwordArray, setPasswordArray] = useState([])

  const getPasswords = async () => {
    let req = await fetch("http://localhost:3000/")
    let passwords = await req.json()
    console.log(passwords)
    setPasswordArray(passwords)
   
  }

  useEffect(() => {
    getPasswords()


  }, [])

  // Function to toggle password visibility
  const showPassword = () => {
    setShowPass((prev) => !prev); // Toggle state

    if (ref.current.src.includes("icons/eyecross.png")) {
      ref.current.src = "icons/eye.png";
      alert("don't see the  password")
    } else {
      ref.current.src = "icons/eyecross.png";
      alert(" see the password")
    }
  };

  // Function to handle form input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const savePassword = async () => {
    //if any such id exists in the db, delete it
  await fetch("http://localhost:3000/",{method:"DELETE",headers:{
      "Content-Type":"application/json"},body:JSON.stringify({id:form.id})
    })

    setPasswordArray([...passwordArray, { ...form, id: uuidv4() }])
     await fetch("http://localhost:3000/",{method:"POST",headers:{"content-Type":"application/json"},
    body:JSON.stringify({...form,id:uuidv4() })})
   // localStorage.setItem("passwords", JSON.stringify([...passwordArray, { ...form, id: uuidv4() }]))
    //console.log(...passwordArray, form)
    setForm({ site: "", username: "", password: "" })
  };
  const deletePassword =async (id) => {

    console.log("Deleting password with id", id)

    let c = confirm("Do you really want to delete this password?")
    if (c) {

      setPasswordArray(passwordArray.filter(item => item.id !== id))
      let res = await fetch("http://localhost:3000/",{method:"DELETE",headers:{"content-Type":"application/json"},body:JSON.stringify({id})})
     // localStorage.setItem("passwords", JSON.stringify(passwordArray.filter(item => item.id !== id)))

    }
  };


  const editPassword = (id) => {
    console.log("editing password with id", id)
    setForm({...passwordArray.filter(i => i.id === id)[0],id:id})
    setPasswordArray(passwordArray.filter(item => item.id !== id))

  };

  return (
    <div className="main">
    <div className="">
      
      <h1 className="passop">
        <span className="">&lt;</span>
        <span className="">Pass</span>
        <span className="op">OP/&gt;</span>
      </h1>
      <h2 className="p">Your own <span className='ss'> Password</span>  Manager</h2>
<div className="">
 
      <div className="">
        <input
          value={form.site}
          onChange={handleChange}
          type="text"
          name="site"
          placeholder="Enter Website URL"
          className="border p-2 mb-2 w-64"
        />

        <div className="">
          <input
            value={form.username}
            onChange={handleChange}
            type="text"
            name="username"
            placeholder="Username"
            className="border p-2"
          />

          <div className="">
            {/* Toggle password visibility based on state */}
            <input
              value={form.password}
              onChange={handleChange}
              type={showPass ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="border p-2"
            />
          
            <span className="r" onClick={showPassword}>
              <img
                ref={ref}
                className="eye"
                width={25}
                
                src="icons/eye.png"
                alt="eye"
              />
            </span>
          </div>

          <button onClick={savePassword} className="">
            Save Password
          </button>
          
        </div>
        <div className="passwords">
          </div>
          <h2>Your <span className='ss'>Passwords</span></h2>
          
          <div className="t">
         
          {passwordArray.length === 0 && <h2> No passwords to show</h2>}
         
          {passwordArray.length != 0 && <table>
            <thead>
              <tr>
                <th>Site</th>
                <th>Username</th>
                <th>Password</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {passwordArray.map((item, index) => {
                return <tr key={index}>
                  <td className='site'><a href={item.site}target='_blank' >{item.site}</a>


                  </td>
                  <td>{item.username}</td>
                  <td>{item.password}</td>

                  <td>
                    <span className='edit' onClick={() => { editPassword(item.id) }}>Edit</span>
                    <span className='delete' onClick={() => { deletePassword(item.id) }}>Delete</span></td>
                </tr>
              })}

            </tbody>
          </table>}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Manager;
