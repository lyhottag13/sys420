import "../styles/index.css";
import { TestsProvider } from "../store/testsContext";
import { UserProvider } from "../store/userContext";
import { SpecificationsProvider } from "../store/specificationsContext";
import {useRouter} from 'next/router';

/**
/**
 * Main application component responsible for providing context providers based on the current route.
 *
 * @param {object} Component - The main component to render.
 * @param {object} pageProps - The props to pass to the main component.
 * @return {JSX} The main application component.
 */
function MyApp({ Component, pageProps }) {
  const router = useRouter();

  return(
    <UserProvider>
      {
        (
          (router.pathname.slice(1,10)  == "reporting" || (router.query.lastPath && router.query.lastPath.slice(1,10))  == "reporting") && 
          <TestsProvider>
            <Component {...pageProps} />
          </TestsProvider>
        ) 
        ||
        (
          (router.pathname.slice(1,15)  == "specifications" || (router.query.lastPath && router.query.lastPath.slice(1,15))  == "specifications") &&
          <SpecificationsProvider>
            <Component {...pageProps} />
          </SpecificationsProvider>
        )
        ||
        <Component {...pageProps} />
      }
    </UserProvider>
  );
}

export default MyApp;
.0