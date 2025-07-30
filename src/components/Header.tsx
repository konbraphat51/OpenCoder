interface HeaderProps {
  className?: string;
}

export const Header = ({ className = '' }: HeaderProps) => {
  return (
    <div className={`app-header ${className}`}>
      <a 
        href="https://github.com/konbraphat51/OpenCoder/blob/main/USER-README.md"
        target="_blank"
        rel="noopener noreferrer"
        className="how-to-use-link"
      >
        📖 How To Use
      </a>
    </div>
  );
};
