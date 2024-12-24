import React,{useState} from "react"
import "./searchresults.css"
import {SearchResult} from "@/components/searchbar/searchresult";
const SearchResults=({results, temp2})=>{
    if(results==null||results.length==0)
        return null;
    return (
        <div className="search-result-list">
           {results.map((result, id) => {
        return <SearchResult result={result.name} temp2={temp2} temp={result.id} key={id} />;
      })}
        </div>
    )
}
export default SearchResults;