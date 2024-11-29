import React,{useState} from "react"
import api from "@/utils/api";
import styles from "@/components/navbar/RebelHubNavBar.module.css";

const Searchbar=({setResults})=> {
    const [input,setInput]=useState("");
    const getHubs_Clubs=async (value)=>{
       try {
            if (value == "") {
        // If the input is empty, reset the results
        setResults([]);
        return;
      }
           const response = await api.get("api/hubs/");

           const results=response.data.filter((item)=>
           {
            return item.name.toLowerCase().includes(value.toLowerCase());
           });
           console.log(results);
           setResults(results);

       } catch(error){
           alert(error);
       }

    }
    const handleChange= (value)=>{
        setInput(value);
        getHubs_Clubs(value);
    }

    return(

            <input className={styles.searchBar} type="text" placeholder="Search for Clubs or Hubs"
            value={input}
            onChange={(e) => handleChange(e.target.value)}
            />

    )
}
export default Searchbar;