import React,{useState,useEffect,useRef} from 'react'
import './Mainpage.css'
import Axios from 'axios'

function Mainpage() {
    const [productname,setProductname]                 = useState('')
    const [productdescription,setProductdescription]   = useState('')
    const [productquantity,setProductquantity]         = useState('')
    const [producttype,setProducttype]                 = useState('')
    const [imagedata,setImagedata]                     = useState('')
    //for update
    const [inputupdate, setInputupdate]                = useState('')
    const [inputupdatename, setInputupdatename]        = useState('')
    const [inputupdatequantity, setInputupdatequantity]        = useState('')
    const [inputupdatetype, setInputupdatetype]        = useState('')
    //for display
    const [namelist,setNamelist]                       = useState([])

    const inputRef = useRef(null)

    const handleProductname = (e) => {
        setProductname(e.target.value)
    }
    const handleProductdescription = (e )=> {
        setProductdescription(e.target.value)
    }
    const handleQuantity = (e) => {
        setProductquantity(e.target.value)
    }
    const handleType = (e) => {
        setProducttype(e.target.value)
    }
    const handleImagedata = (e) => {
        setImagedata(e.target.files[0])
    }
    //for update
    const handleUpadteinputname = (e) => {
        setInputupdatename(e.target.value)
    }
    const handleUpadteinput = (e) => {
        setInputupdate(e.target.value)
    }
    const handleUpadteQuantity = (e) => {
        setInputupdatequantity(e.target.value)
    }
    const handleUpadteType = (e) => {
        setInputupdatetype(e.target.value)
    }
    const handleSubmit = ()=>{
        //image upload in server
        const data = new FormData()
        //here 'image' comes from 'upload.single('image')'
        data.append('image', imagedata)
        fetch('http://localhost:3001/single', {
            method: "post",
            body: data,
        })
        //insert info in database
        if(productname === '' || productdescription === '' || productquantity === '' || producttype === ''){
            alert('Information is missing!')
        }else{
    Axios.post('http://localhost:3001/api/insert',
    {productname:productname,productdescription:productdescription,image:'imagedata',productquantity:productquantity, producttype:producttype})
        .then(()=>{    
            //adding data with previous datalist
           setNamelist([...namelist,{productname:productname,productdescription:productdescription,productquantity:productquantity, producttype:producttype}])
        }) 
        //clear input field >>>>> value = {firstname}
        setProductdescription('')
        setProductname('') 
        setProductquantity('') 
        setProducttype('') 
        } 
    }
    const handleDelete = (id)=>{
        Axios.delete(`http://localhost:3001/api/delete/${id}`)
        .then(()=>{    
            //adding data with previous datalist
            setNamelist([...namelist,{productname:productname,productdescription:productdescription,productquantity:productquantity, producttype:producttype}])
        }) 
    }
    const handleUpdate = (id)=>{
        Axios.put("http://localhost:3001/api/update",{id:id,productname:inputupdatename, productdescription:inputupdate,productquantity:inputupdatequantity, producttype:inputupdatetype})
        .then(()=>{    
            //adding data with previous datalist
           setNamelist([...namelist,{productname:inputupdatename,productdescription:inputupdate,productquantity:inputupdatequantity, producttype:inputupdatetype}])
        }) 
        setInputupdate('')       
    }
    //input focus
    useEffect(() => {
    inputRef.current.focus()
    }, [])

    useEffect(() => {
        Axios.get('http://localhost:3001/api/get')
        .then((response)=>{
        //console.log(response.data)
        setNamelist(response.data)
        })
        //when namelist change then update data wihtout refresh
    }, [namelist])

    return (
        <>
        <h1>Dashboard</h1> 
        <div className ='Main'>
           <div className = 'inputData'>
            <input type ='file'
            onChange = {handleImagedata}
            />

           <input type="text" 
           ref={inputRef}
           placeholder='Product name' 
           value = {productname} 
           onChange = {handleProductname}/>
           
           <textarea type="text" 
           placeholder='Product description' 
           value = {productdescription} 
           onChange = {handleProductdescription}/>

            <input type="text" 
           placeholder='Product quantity' 
           value = {productquantity} 
           onChange = {handleQuantity}/>

           <input type="text" 
           placeholder='Product type' 
           value = {producttype} 
           onChange = {handleType}/>
          
           <button onClick={handleSubmit}>Add</button>
           </div>
           
           <table>
            <tr>
                <th>Product Name</th>
                <th className = 'description'>Description</th> 
                <th>Quantity</th> 
                <th>Type</th> 
                <th className = 'thirdTh'>Action</th>
            </tr>
           {namelist.map((value)=>{
               return(  
            <tr key = {value.id}>
                <td>
                   <input type='text'
                   value = {inputupdatename ? null : value.productname}
                   onChange = {handleUpadteinputname}
                   />
                </td>
                <td>
                   <input 
                   className = 'tdDescription'
                   type='text'
                   value = {inputupdate ? null : value.productdescription}
                   onChange = {handleUpadteinput}
                   />
                </td>
                <td>
                   <input type='text'
                   value = {inputupdatequantity ? null : value.quantity}
                   onChange = {handleUpadteQuantity}
                   />
                </td>
                <td>
                   <input type='text'
                   value = {inputupdatetype ? null : value.type}
                   onChange = {handleUpadteType}
                   />
                </td>
                <td>
                <div className = 'deleteButton'><button onClick = {()=>{handleDelete(value.id)}}>Delete</button></div>
                <div className = 'deleteUpdate'>
                <button  onClick = {()=>handleUpdate(value.id)}>Update</button>
                </div>
                </td>
            </tr>
            )
        })}
            </table>
            
        </div>
        </>
    )
}
export default Mainpage
