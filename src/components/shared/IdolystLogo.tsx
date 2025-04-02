
const IdolystLogo = ({ size = "default" }: { size?: "small" | "default" | "large" }) => {
  const sizeClasses = {
    small: "text-lg",
    default: "text-xl",
    large: "text-2xl",
  };

  return (
    <span className={`font-bold ${sizeClasses[size]} gradient-text`}>
      Idolyst
    </span>
  );
};

export default IdolystLogo;
