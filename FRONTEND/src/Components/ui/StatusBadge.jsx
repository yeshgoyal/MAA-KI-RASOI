const StatusBadge = ({ status }) => {
  const getStyles = (s) => {
    switch (s?.toLowerCase()) {
      case 'placed':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'confirmed':
        return 'bg-secondary-100 text-secondary-700 border-secondary-200';
      case 'preparing':
        return 'bg-accent-100 text-accent-700 border-accent-200';
      case 'out for delivery':
        return 'bg-primary-100 text-primary-700 border-primary-200';
      case 'delivered':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'paid':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getStyles(status)}`}>
      {status || 'Unknown'}
    </span>
  );
};

export default StatusBadge;
