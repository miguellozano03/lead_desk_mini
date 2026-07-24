export const ErrorMessage = ({ message }: { message?: string }) => (
  <p
    className={`text-sm text-red-500 transition-opacity duration-200 ${
      message ? "visible opacity-100" : "invisible opacity-0"
    }`}
  >
    {message || "placeholder"}
  </p>
);
