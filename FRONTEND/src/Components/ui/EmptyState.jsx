import { FiInbox } from 'react-icons/fi';

const EmptyState = ({ title, message, action, icon }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-dashed border-gray-300">
      <div className="w-20 h-20 rounded-full bg-primary-50 text-primary-400 flex items-center justify-center mb-6 text-4xl">
        {icon || <FiInbox />}
      </div>
      <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-sm mb-6 leading-relaxed bg-white/50">{message}</p>
      {action && (
        <div>{action}</div>
      )}
    </div>
  );
};

export default EmptyState;
