// import React,{useState} from "react";
import Swal from "sweetalert2"; 
// import { Message, useToaster } from 'rsuite';
  const Alert = {
    errorLoing(name){ 
      Swal.fire({
      title: 'ຂໍອະໄພ!',
      text: name,
      icon: 'error',
      width:400,
      confirmButtonText: 'ຕົກລົງ',
      confirmButtonColor: "#3085d6",
    })
  },
    errorData(name){ 
      Swal.fire({
      title: 'ຂໍອະໄພ!',
      text: name,
      icon: 'error',
      width:400,
      confirmButtonText: 'ຕົກລົງ',
      confirmButtonColor: "#3085d6",
    })
  },
  
  successData(name){ 
    Swal.fire({
    title: 'ຢືນຢັນ!',
    text: name,
    icon: 'success',
    // padding: "1em",
    width: 400,
    height:200,
    confirmButtonText: 'ຕົກລົງ',
    confirmButtonColor: "#0fac29",
  })
},



warningData(name){
  Swal.fire({
    title: "ຂໍອະໄພ",
    text: name,
    width:400,
    icon: "info",
    confirmButtonColor: "#0fac29",
  })
},
// Notification(titleName,messName,notifi){
//   const toaster = useToaster();
// const [placement, setPlacement] = useState('topEnd');
// const message = (
//   <Message showIcon type={notifi} closable>
//     <strong>{titleName} </strong> {messName}
//   </Message>
// );
// toaster.push(message, { placement });
// }
  }


  export default Alert;

  
