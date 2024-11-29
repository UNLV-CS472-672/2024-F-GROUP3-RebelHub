import React,{useState} from "react"
import "./searchresults.css"
import {SearchResult} from "@/components/searchbar/searchresult";
const SearchResults=({results})=>{
    if(results==null||results.length==0)
        return null;
    return (
        <div className="search-result-list">
           {results.map((result, id) => {
        return <SearchResult result={result.name} key={id} />;
      })}
        </div>
    )
}
export default SearchResults;