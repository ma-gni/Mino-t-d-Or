/**
 * Notification.jsx
 * --------------------------------------------------
 * Composant de notification pour l'application
 * 
 * Ce composant affiche des notifications avec :
 * - Différents types (success, error, warning, info)
 * - Animation d'apparition/disparition
 * - Auto-dismiss configurable
 * - Actions personnalisables
 */

import React, { useState, useEffect } from 'react';

/**
 * Composant Notification
 * 
 * @param {Object} props - Les propriétés du composant
 * @param {string} props.type - Type de notification (success, error, warning, info)
 * @param {string} props.title - Titre de la notification
 * @param {string} props.message - Message de la notification
 * @param {number} [props.duration] - Durée d'affichage en ms (0 = pas d'auto-dismiss)
 * @param {boolean} [props.show] - Afficher la notification
 * @param {Function} [props.onClose] - Fonction appelée à la fermeture
 * @param {Array} [props.actions] - Actions personnalisées
 * @returns {JSX.Element} Le composant Notification
 */
export default function Notification({
  type = 'info',
  title,
  message,
  duration = 5000,
  show = false,
  onClose,
  actions = []
}) {
  const [isVisible, setIsVisible] = useState(show);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    setIsVisible(show);
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsExiting(false);
      if (onClose) {
        onClose();
      }
    }, 300);
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          icon: 'text-green-400',
          title: 'text-green-800',
          message: 'text-green-700',
          iconSymbol: '✓'
        };
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          icon: 'text-red-400',
          title: 'text-red-800',
          message: 'text-red-700',
          iconSymbol: '✕'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          icon: 'text-yellow-400',
          title: 'text-yellow-800',
          message: 'text-yellow-700',
          iconSymbol: '⚠'
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          icon: 'text-blue-400',
          title: 'text-blue-800',
          message: 'text-blue-700',
          iconSymbol: 'ℹ'
        };
    }
  };

  const styles = getTypeStyles();

  if (!isVisible) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm w-full ${isExiting ? 'animate-slide-out' : 'animate-slide-in'}`}>
      <div className={`${styles.bg} ${styles.border} border rounded-lg shadow-lg p-4`}>
        <div className="flex items-start">
          {/* Icône */}
          <div className={`flex-shrink-0 ${styles.icon}`}>
            <span className="text-xl">{styles.iconSymbol}</span>
          </div>

          {/* Contenu */}
          <div className="ml-3 flex-1">
            {title && (
              <h3 className={`text-sm font-medium ${styles.title}`}>
                {title}
              </h3>
            )}
            {message && (
              <p className={`text-sm ${styles.message} mt-1`}>
                {message}
              </p>
            )}

            {/* Actions */}
            {actions.length > 0 && (
              <div className="mt-3 flex space-x-2">
                {actions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.onClick}
                    className={`text-xs font-medium px-3 py-1 rounded-md transition-colors ${
                      action.primary
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bouton de fermeture */}
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={handleClose}
              className={`inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors`}
            >
              <span className="sr-only">Fermer</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Hook pour gérer les notifications
 */
export const useNotification = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const id = Date.now();
    const newNotification = { ...notification, id };
    setNotifications(prev => [...prev, newNotification]);
    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const showSuccess = (title, message, options = {}) => {
    return addNotification({
      type: 'success',
      title,
      message,
      ...options
    });
  };

  const showError = (title, message, options = {}) => {
    return addNotification({
      type: 'error',
      title,
      message,
      ...options
    });
  };

  const showWarning = (title, message, options = {}) => {
    return addNotification({
      type: 'warning',
      title,
      message,
      ...options
    });
  };

  const showInfo = (title, message, options = {}) => {
    return addNotification({
      type: 'info',
      title,
      message,
      ...options
    });
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};

/**
 * Composant NotificationContainer pour afficher toutes les notifications
 */
export function NotificationContainer() {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          {...notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
} 