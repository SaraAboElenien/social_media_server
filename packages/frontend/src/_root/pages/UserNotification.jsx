import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "@/Context/UserContext";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "@/api/axios";


const Notifications = () => {
  const { userToken } = useContext(UserContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(
          "/api/v1/auth/notification/",
          {
            headers: { Authorization: `Bearer ${userToken}` },
          }
        );
        setNotifications(response.data.notifications);
      } catch {
        setError("Failed to fetch notifications.");
        toast.error("Error fetching notifications.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);

    return () => clearInterval(interval);
  }, [userToken]);

  const markAsRead = async (notificationId) => {
    try {
      await api.patch(
        `/api/v1/auth/notification/${notificationId}/read`,
        null,
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notificationId ? { ...n, isRead: true } : n
        )
      );
      toast.success("Notification marked as read.");
    } catch {
      toast.error("Failed to mark notification as read.");
    }
  };

  const getNotificationText = (notification) => {
    const senderName = `${notification.sender.firstName} ${notification.sender.lastName}`;
    switch (notification.type) {
      case "like":
        return `${senderName} liked your post "${notification.postTitle || 'Nature Love'}"`;
      case "comment":
        return `${senderName} commented on your photo`;
      case "follow":
        return `${senderName} followed you`;
      case "save":
        return `${senderName} saved your video`;
      case "share":
        return `${senderName} shared your post`;
      default:
        return notification.content;
    }
  };

  const getStatusColor = (notification) => {
    switch (notification.type) {
      case "like":
      case "comment":
        return "bg-red-500";
      case "save":
      case "share":
      case "follow":
        return "bg-green-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <div className="flex flex-1">
      <div className="common-container">
        {/* Header */}
        <div className="flex items-center gap-3 w-full max-w-5xl mb-8">
          <img
            src="/assets/images/notification-alert.svg"
            width={24}
            height={24}
            alt="Notifications"
            className="invert-white"
          />
          <h1 className="h3-bold md:h2-bold text-light-1">Notifications</h1>
          <span className="text-primary-500 text-sm ml-auto cursor-pointer">All</span>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex-center py-8">
            <div className="flex items-center gap-2">
              <img 
                src="/assets/images/loader.svg" 
                alt="Loading..." 
                width={20} 
                height={20}
                className="animate-spin"
              />
              <p className="text-light-2">Loading notifications...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex-center py-8">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && notifications.length === 0 && (
          <div className="flex-center py-8">
            <p className="text-light-3">No notifications yet.</p>
          </div>
        )}

        {/* Notifications List */}
        <div className="w-full max-w-3xl">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className="flex items-center gap-4 p-4 hover:bg-dark-4 rounded-lg transition-colors cursor-pointer"
              onClick={() => markAsRead(notification._id)}
            >
              {/* Profile Image */}
              <Link 
                to={`/profile/${notification.sender._id}`}
                className="flex-shrink-0"
              >
                <img
                  src={notification.sender.profileImage?.secure_url || "/assets/images/profile-placeholder.svg"}
                  alt={`${notification.sender.firstName}'s profile`}
                  className="w-12 h-12 rounded-full object-cover"
                  onError={(e) => {
                    if (e.target instanceof HTMLImageElement) {
                      e.target.src = "/assets/images/profile-placeholder.svg";
                    }
                  }}
                />
              </Link>

              {/* Notification Content */}
              <div className="flex-1 min-w-0">
                <p className="text-light-1 text-sm leading-relaxed">
                  {getNotificationText(notification)}
                </p>
                <p className="text-light-3 text-xs mt-1">
                  {new Date(notification.createdAt).toLocaleString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })} ago
                </p>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-3">
                {/* Follow back button - placeholder for future implementation */}
                {notification.type === "follow" && (
                  <button className="px-4 py-1.5 bg-primary-500 text-white text-sm rounded-md hover:bg-primary-600 transition-colors">
                    Follow back
                  </button>
                )}
                
                {/* Status dot */}
                <div 
                  className={`w-2.5 h-2.5 rounded-full ${getStatusColor(notification)} ${
                    notification.isRead ? 'opacity-30' : ''
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
