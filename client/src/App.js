import React, { } from "react";
import './css/index.css';
import Axios from 'axios';
import DatePicker from 'react-date-picker';

import Header from './elements/Header';
import Rota from './elements/Rota';

function App() {
  // const  [name, setName] = useState('')
  // const  [role, setRole] = useState('')
  // const  [newRole, updateNewRole] = useState('')
  // const [peopleList, setPeopleList] = useState([])
  // const [date, onChange] = useState(new Date());


  // useEffect(()=> {
  //   Axios.get('http://localhost:3001/api/get').then((respons)=> {
  //     setPeopleList(respons.data)
  //   })
  // }, [])

  
  // const deletePerson = (name) => {
  //     console.log('del')
  //     Axios.delete(`http://localhost:3001/api/delete/${name}`);
  // }
  // const updateRole = (name) => {
  //   Axios.put(`http://localhost:3001/api/update`, {
  //     peopleName: name,
  //     peopleRole: newRole
  //   });
  //   updateNewRole("")
  // }


  return (
    <>
      <Header 
        Axios={Axios}
      />
      <Rota 
        Axios={Axios}
        DatePicker={DatePicker}
      />
    </>
  );
}

export default App;
