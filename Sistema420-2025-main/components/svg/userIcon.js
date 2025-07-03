/**
 * Renders a SVG user icon.
 * 
 * This component is designed to display a user icon, which can be used in various parts of a user interface
 * where a graphical representation of a user or profile is needed. The component allows for custom styling
 * through a className prop, enabling it to be easily integrated and styled within different parts of an application.
 * 
 * @param {string} {className} - An optional CSS class for styling the SVG element.
 * @returns {JSX.Element} A SVG element configured to display a user icon. The icon includes a circular
 * background with a stylized representation of a user figure in the center. The icon's visual aspects,
 * such as its fill, stroke, and path details, are defined within the SVG's path element, and can be customized
 * with external CSS.
 */

export default function UserIcon({ className }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={ className }
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10ZM12 7C12 8.10457 11.1046 9 10 9C8.89543 9 8 8.10457 8 7C8 5.89543 8.89543 5 10 5C11.1046 5 12 5.89543 12 7ZM9.99993 11C7.98239 11 6.24394 12.195 5.45374 13.9157C6.55403 15.192 8.18265 16 9.99998 16C11.8173 16 13.4459 15.1921 14.5462 13.9158C13.756 12.195 12.0175 11 9.99993 11Z"
      />
    </svg>
  );
}
