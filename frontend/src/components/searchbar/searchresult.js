import "./searchresult.css";
import {useRouter} from "next/navigation";

export const SearchResult = ({ result,temp, temp2 }) => {
  const router=useRouter();
  const redirect=()=>{
    temp2([]);
    router.push(`/hubs/${temp}`);
  }
  return (
    <div
      className="search-result"
      onClick={redirect}
    >
      {result}
    </div>
  );
};
