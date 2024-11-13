import { NotificationManager } from 'react-notifications';

export const Notification = {
    info: (message, title, duration = 3000) => {
      NotificationManager.info(message, title, duration);
    },
    success: (message, title, duration = 3000) => {
      NotificationManager.success(message, title, duration);
    },
    warning: (message, title, duration = 3000) => {
      NotificationManager.warning(message, title, duration);
    },
    error: (message, title, duration = 3000) => {
      NotificationManager.error(message, title, duration);
    },
  
   
  };
