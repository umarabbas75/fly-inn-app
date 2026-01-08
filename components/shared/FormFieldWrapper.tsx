// FormFieldWrapper component to reserve consistent space for validation messages
const FormFieldWrapper: React.FC<{
  children: React.ReactNode;
  error?: any;
  className?: string;
}> = ({ children, error, className = "" }) => (
  <div className={`${className}`}>
    {children}
    <div className="md:h-6 mt-2">
      {error && (
        <p className="text-red-500 text-sm">{error.message?.toString()}</p>
      )}
    </div>
  </div>
);

export default FormFieldWrapper;
