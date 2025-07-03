import { useEffect, useState } from 'react';
import {useRouter} from 'next/router';
import { useTestsStore } from "../../store/testsContext";


/**
 * A functional component that handles the finalization of a test search and navigates to the appropriate page.
 * 
 * Upon mounting, 'FinishTest' checks if the necessary query parameters are present in the URL. If not, it redirects the user
 * to the filter page. Otherwise, it updates the global search parameters with the provided query parameters and checks the 
 * results. Based on the results of the search, it either redirects back to the filter page if no tests are found, or to the 
 * summary page if tests are available.
 * 
 * @component
 * @example
 * return <FinishTest />
 * 
 * @returns {JSX.Element} A loading message displayed while the component processes the search and navigation logic.
 */
export default function FinishTest() {
  const [isNewSearch, setIsNewSearch] = useState(false);
  const {currentSearch, updateParams} = useTestsStore();
  const router = useRouter();

  console.log();

  // Effect hook to handle initial URL query parameters and redirect if necessary.
  useEffect( async ()=>{
    // The async function is directly called inside the effect to handle query parameters.
    if(!router.isReady) return;
    if(!router.query.id) router.push('/reporting/filter'); 
    await updateParams(router.query);
    setIsNewSearch(true);
  });
  useEffect(()=>{
    if(!isNewSearch) return;
    if(currentSearch.tests.length < 1){
      return router.push('/reporting/filter'); 
    }

    router.push('/reporting/summary')
  },[currentSearch])
  


  return <p>Loading...</p>;
}
