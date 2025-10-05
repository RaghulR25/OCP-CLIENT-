const Button = ({ children, className, ...props }) => (
  <button {...props} className={`bg-blue-600 text-white p-2 rounded hover:bg-blue-700 ${className}`}>
    {children}
  </button>
);

export default Button;
