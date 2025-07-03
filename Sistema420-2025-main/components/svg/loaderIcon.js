/**
 * Represents a Loader icon using SVG.
 * This component renders a circular loader icon that can be styled with a passed className.
 *
 * @component
 * @param {string} className - The CSS class for styling the loader icon.
 * @returns {React.ReactElement} The SVG element representing the loader icon.
 */
export default function LoaderIcon({className}){
    return(
// SVG element with a set viewbox and possible className for styling
<svg className={className} viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" fillRule="evenodd">
        <g transform="translate(1 1)" strokeWidth="2">
            <circle strokeOpacity=".5" cx="18" cy="18" r="18"/>
                <path d="M36 18c0-9.94-8.06-18-18-18">
            </path>
        </g>
    </g>
</svg>
    );
}