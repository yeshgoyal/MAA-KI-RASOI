const StatCard = ({ title, value, icon, color = 'primary' }) => {
  const colorMap = {
    primary: 'bg-primary-50 text-primary-500',
    secondary: 'bg-secondary-50 text-secondary-500',
    accent: 'bg-accent-50 text-accent-500',
    blue: 'bg-blue-50 text-blue-500',
    green: 'bg-green-50 text-green-500',
    red: 'bg-red-50 text-red-500',
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1">
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${colorMap[color] || colorMap.primary}`}>
        {icon}
      </div>
      <div>
        <h4 className="text-gray-500 text-sm font-medium">{title}</h4>
        <p className="text-2xl font-display font-bold text-gray-900 mt-1">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
