const NotificationCard = ({ notification }) => {


  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-blue-600 hover:shadow-lg transition-shadow">
      <h3 className="font-semibold text-blue-600 text-lg">
        {notification.type}
      </h3>

      <p className="text-gray-700 dark:text-gray-300 mt-2 text-base leading-relaxed">
        {notification.message}
      </p>

      <p className="text-sm text-gray-400 mt-3">
        {notification.sentDate}
      </p>
    </div>
  );
};

export default NotificationCard;