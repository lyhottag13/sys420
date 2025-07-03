/**
 * A functional component that returns a SVG menu icon.
 * 
 * This component displays a menu icon suitable for use in navigation bars or any user interface
 * element that requires a graphical representation of a menu. The appearance of the icon can be
 * customized by applying CSS classes.
 * 
 * @export
 * @param {string} {className} - An optional CSS class to apply to the SVG element for styling.
 * @returns {JSX.Element} A SVG element representing a menu icon.
 */

export default function MenuIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 6H20M4 12H20M4 18H20"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
