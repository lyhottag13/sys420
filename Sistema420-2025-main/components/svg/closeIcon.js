/**
 * CloseIcon Component
 * Renders an SVG close icon (X shape inside a circle). This icon is commonly
 * used for closing modal dialogs, dismissing elements, or as a delete button in user interfaces.
 * 
 * Props:
 * @param {string} className - A CSS class name that can be used to style the SVG icon. 
 * This allows for custom styling (such as size, color, hover effects) to be applied.
 * 
 * returns:
 * - A SVG component that represents a Close Icon.
 * 
 * The component can be styled using TailwindCSS or any other CSS methodology by passing
 * appropriate class names. The icon itself is designed with responsiveness in mind, making
 * it suitable for various UI contexts where a close or cancel action is needed.
 */
export default function CloseIcon({ className }) {
  return (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10 14L12 12M12 12L14 10M12 12L10 10M12 12L14 14M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
  );
}
