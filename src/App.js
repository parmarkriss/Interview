import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [record, setRecord] = useState([]);
  const [editid,setEditid] = useState("");

  const handleSubmit = () => {
    if(editid){
      axios.put(`http://localhost:8000/crud/${editid}`,{
          name : name,
          email : email,
      })
      .then((res)=>{
         setEditid("");
         fetchRecord();
         alert("Record edit successfully");
      })
      .catch((err)=>{
         console.log(err);
         return false;
      })
    }else{
      axios.post(`http://localhost:8000/crud`, {
        name: name,
        email: email,
      })
        .then((res) => {
          fetchRecord();
          alert("Record successfully insert");
        })
        .catch((err) => {
          console.log(err);
          return false;
        })
    }
    setName("");
    setEmail("");
  } 

  const handleDelete = (id) =>{
      axios.delete(`http://localhost:8000/crud/${id}`)
      .then((res)=>{
         fetchRecord();
         alert("Record delete");
      })
      .catch((err)=>{
         console.log(err);
         return false;
      })
  }

  const handleEdit = async(id) =>{
      try {
         let editrecord = await axios.get(`http://localhost:8000/crud/${id}`);
         if(editrecord){
           setName(editrecord.data.name);
           setEmail(editrecord.data.email);
           setEditid(editrecord.data.id);
         }else{
            console.log("Record is not found");
            return false;
         }
      } catch (error) {
         console.log(error);
         return false;
      }
  }

  const fetchRecord = () => {
    axios.get(`http://localhost:8000/crud`)
      .then((res) => {
        setRecord(res.data);
      })
      .catch((err) => {
        console.log(err);
        return false;
      })
  }

  useEffect(() => {
    fetchRecord();
  })

  return (
    <>
      <center>
        <table border={2}>
          <tr>
            <td>Name:- </td>
            <td><input type='text' name='name' onChange={(e) => setName(e.target.value)} value={name}></input></td>
          </tr>
          <tr>
            <td>Email:- </td>
            <td><input type='text' name='email' onChange={(e) => setEmail(e.target.value)} value={email}></input></td>
          </tr>
          <tr>
            <td></td>
            <td>
              {
                 editid ? ( <input type='button' onClick={() => handleSubmit()} value="edit"></input>) : ( <input type='button' onClick={() => handleSubmit()} value="Submit"></input>)
              }
             </td>
          </tr>
        </table><br></br>

        <table border={2}>
           <thead>
             <tr>
               <td>Name</td>
               <td>Email</td>
               <td>Action</td>
             </tr>
           </thead>

           <tbody>
              {
                 record.map((v)=>{
                    return(
                        <tr>
                          <td>{v.name}</td>
                          <td>{v.email}</td>
                          <td>
                             <input type='button' onClick={()=> handleDelete(v.id)} value="Delete"></input> || <input type='button' onClick={()=> handleEdit(v.id)} value="Edit"></input>
                          </td>
                        </tr>
                    )
                 })
              }
           </tbody>
        </table>
      </center>
    </>
  );
}

export default App;
