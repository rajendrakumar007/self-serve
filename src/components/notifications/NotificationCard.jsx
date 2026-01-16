const NotificationCard = ({ notification }) => {
  const isUnread = !notification.read;

  // Function to strictly capitalize only the first letter
  const formatTitle = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-l-4 hover:shadow-lg transition-shadow ${
        isUnread ? "border-blue-600" : "border-gray-300"
      }`}
    >
      <div className="flex items-start justify-between">
        <h3 className="font-semibold text-blue-600 text-lg">
          {formatTitle(notification.type)}
        </h3>
        {isUnread && (
          <span className="ml-2 h-2 w-2 rounded-full bg-blue-600" aria-label="Unread" />
        )}
      </div>

      <p className="text-gray-700 dark:text-gray-300 mt-2 text-base leading-relaxed">
        {notification.message}
      </p>
    </div>
  );
};

export default NotificationCard;