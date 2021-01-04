import './css/index.css';
import Axios from 'axios';
import DatePicker from 'react-date-picker';
import Rota from './elements/Rota';
import React, { Component } from 'react'

export default class App extends Component {  
  render() {
    return (
      <>
        <Rota 
          Axios={Axios}
          DatePicker={DatePicker}
        />
      </>
    )
  }
}


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



// export default App;
