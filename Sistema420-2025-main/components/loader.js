import LoaderIcon from './svg/loaderIcon';

/**
 * Loader component that displays a fullscreen overlay with a spinning LoaderIcon.
 * This component is typically used to indicate that a page or section is loading.
 */
export default function Loader(){
    return (
        // Fullscreen overlay container with semi-transparent background
        <div className="z-100 top-0 left-0 fixed bg-opacity-30 h-screen w-screen bg-black flex items-center justify-center">
            {/* Spinning LoaderIcon SVG component */}
            <LoaderIcon className="stroke-current text-red-800 w-28 animate-spin"/>
        </div>
      );
}

   