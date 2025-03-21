import { useState, useEffect } from "react";
import { Text, Icon } from "@shopify/polaris";
import {
  CartAbandonedIcon,
  CheckCircleIcon,
  DeliveryIcon,
  ComposeIcon,
  DiscountIcon,
  CashDollarIcon,
  StatusActiveIcon,
} from "@shopify/polaris-icons";
import { EVENT_DESCRIPTIONS, EVENT_TEMPLATES } from "../constants/events";

const EVENT_ICONS: Record<string, any> = {
  abandoned_cart: CartAbandonedIcon,
  order_confirmation: CheckCircleIcon,
  order_shipped: DeliveryIcon,
  review_request: ComposeIcon,
  send_limited_time_promotion: DiscountIcon,
  customer_first_purchase: CashDollarIcon,
  win_back_campaign: StatusActiveIcon,
};

const EVENT_IMAGES: Record<string, string> = {
  abandoned_cart: "/abandoned_cart.png",
  order_confirmation: "/order_confirmation.png",
  order_shipped: "/order_shipped.png",
  review_request: "/review.png",
  send_limited_time_promotion: "/discount.png",
  customer_first_purchase: "/first_customer.png",
  win_back_campaign: "/win.png",
};

const DEFAULT_SCREEN = {
  description:
    "Triggers determine when your automated messages will be sent. Choose a trigger to see how it works and when it will activate.",
  image: "/default.png",
};

export default function EventSelection({
  event, 
  setEvent, 
  setMessage
}: {
  event: string | null; 
  setEvent: (selectedEvent: string) => void; 
  setMessage: (message: string) => void;
}) {
  const [selectedEvent, setSelectedEventLocal] = useState<string | null>(event); 

  useEffect(() => {
    setSelectedEventLocal(event); 
  }, [event]);

  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);
  const activeEvent = hoveredEvent || selectedEvent;

  return (
    <div>
      <div style={{ display: "flex", gap: "40px" }}>
        <div style={{ width: "50%" }}>
          {Object.keys(EVENT_DESCRIPTIONS).map((eventId) => (
            <div
              key={eventId}
              onClick={() => {
                setSelectedEventLocal(eventId);
                setEvent(eventId); 
                setMessage(EVENT_TEMPLATES[eventId] || ""); 
              }}
              onMouseEnter={() => setHoveredEvent(eventId)}
              onMouseLeave={() => setHoveredEvent(null)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px",
                cursor: "pointer",
                borderRadius: "8px",
                backgroundColor:
                  selectedEvent === eventId || hoveredEvent === eventId
                    ? "#f0f4ff"
                    : "transparent",
                transition: "background 0.2s ease-in-out",
              }}
            >
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  border: "2px solid #0057D9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: selectedEvent === eventId ? "#0057D9" : "transparent",
                  transition: "background 0.2s ease-in-out",
                }}
              />
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Icon source={EVENT_ICONS[eventId]} tone="base" />
                <Text as="p" fontWeight="bold">
                  {eventId.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </Text>
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            width: "50%",
            padding: "20px",
            backgroundColor: "#f9fafc",
            borderRadius: "8px",
            minHeight: "200px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <img
            src={activeEvent ? EVENT_IMAGES[activeEvent] : DEFAULT_SCREEN.image}
            alt="Event Visual"
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "20%",
              objectFit: "cover",
              marginBottom: "16px",
            }}
          />
          <Text as="p" fontWeight="regular">
            {activeEvent ? EVENT_DESCRIPTIONS[activeEvent] : DEFAULT_SCREEN.description}
          </Text>
        </div>
      </div>
    </div>
  );
}
