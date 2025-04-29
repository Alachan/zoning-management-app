/**
 * Reusable component for displaying a single statistic
 */
const StatItem = ({ label, value, icon, className = "" }) => {
  return (
    <div
      className={`flex flex-col p-2 rounded-lg bg-opacity-70 shadow-sm ${className}`}
    >
      {icon && <div className="mr-3 text-gray-500">{icon}</div>}
      <div className="flex flex-col">
        <span className="text-sm text-gray-700">{label}</span>
        <span className="text-xl font-medium">{value}</span>
      </div>
    </div>
  );
};

export default StatItem;
