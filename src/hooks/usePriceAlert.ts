import { useState, useEffect } from 'react';
import { PriceAlert, NotificationChannel } from '../types/alerts';
import { useMCXPrice } from './useMCXPrice';

export function usePriceAlert() {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const { priceData } = useMCXPrice();
  const [lastNotifiedPrice, setLastNotifiedPrice] = useState<number | null>(null);

  useEffect(() => {
    if (!priceData?.currentPrice) return;

    const currentPrice = priceData.currentPrice;
    
    // Prevent multiple notifications for the same price
    if (lastNotifiedPrice === currentPrice) return;

    alerts.forEach(alert => {
      if (!alert.isActive) return;

      const shouldTrigger = Math.abs(currentPrice - alert.targetPrice) <= 0.01;
      
      if (shouldTrigger) {
        triggerAlert(alert, currentPrice);
        setLastNotifiedPrice(currentPrice);
      }
    });
  }, [priceData?.currentPrice, alerts, lastNotifiedPrice]);

  const createAlert = async (
    targetPrice: number,
    customMessage: string,
    notificationChannels: NotificationChannel[]
  ): Promise<PriceAlert> => {
    const newAlert: PriceAlert = {
      id: crypto.randomUUID(),
      targetPrice,
      currentPrice: priceData?.currentPrice || 0,
      customMessage,
      notificationChannels,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    setAlerts(prev => [...prev, newAlert]);
    return newAlert;
  };

  const triggerAlert = async (alert: PriceAlert, currentPrice: number) => {
    const message = formatAlertMessage(alert, currentPrice);
    
    alert.notificationChannels.forEach(channel => {
      switch (channel) {
        case 'web':
          sendWebNotification(message);
          break;
        case 'whatsapp':
          sendWhatsAppNotification(message);
          break;
        case 'email':
          sendEmailNotification(message);
          break;
      }
    });

    // Update alert status
    setAlerts(prev => prev.map(a => 
      a.id === alert.id 
        ? { ...a, lastTriggeredAt: new Date().toISOString() }
        : a
    ));
  };

  const formatAlertMessage = (alert: PriceAlert, currentPrice: number): string => {
    return `The MCX price has reached Rs. ${currentPrice}/kg\n${alert.customMessage}`;
  };

  const sendWebNotification = async (message: string) => {
    if (!("Notification" in window)) return;

    if (Notification.permission === "granted") {
      new Notification("MCX Price Alert", { body: message });
    } else if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        new Notification("MCX Price Alert", { body: message });
      }
    }
  };

  const sendWhatsAppNotification = async (message: string) => {
    // Implement WhatsApp notification logic here
    console.log('WhatsApp notification:', message);
  };

  const sendEmailNotification = async (message: string) => {
    // Implement email notification logic here
    console.log('Email notification:', message);
  };

  return {
    alerts,
    createAlert,
    setAlerts
  };
}