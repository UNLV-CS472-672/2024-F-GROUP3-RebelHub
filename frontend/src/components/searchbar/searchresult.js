import "./SearchResult.css";
import {useRouter} from "next/navigation";

export const SearchResult = ({ result,temp }) => {
  const router=useRouter();
  const redirect=()=>{
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