import { useEffect, useState } from "react";
import { FormLayout, Checkbox, Spinner } from "@shopify/polaris";
import { useFetcher } from "@remix-run/react";

export default function RecipientSelection({
  handleBack,
  handleSave,
  recipients,
  setRecipients,
}: {
  handleBack: () => void;
  handleSave: () => void;
  recipients: string[];
  setRecipients: (recipients: string[]) => void;
}) {
  const fetcher = useFetcher();
  const [customers, setCustomers] = useState<{ id: string; firstName: string; lastName: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetcher.load("/api/fetch/customers");
  }, []);

  useEffect(() => {
    if (fetcher.data?.success) {
      setCustomers(fetcher.data.customers);
      setLoading(false);
    }
  }, [fetcher.data]);

  const handleCheckboxChange = (customerId: string, newChecked: boolean) => {
    setRecipients((prevRecipients: string[]) => {
      const updatedRecipients = newChecked
        ? [...prevRecipients, customerId]
        : prevRecipients.filter((id) => id !== customerId);
  
      console.log("Updated Recipients List:", updatedRecipients);
      return updatedRecipients;
    });
  };

  return (
    <div>
      <FormLayout>
        {loading ? (
          <Spinner accessibilityLabel="Loading customers" size="large" />
        ) : (
          customers.map((customer) => (
            <Checkbox
              key={customer.id}
              label={`${customer.firstName} ${customer.lastName}`}
              checked={recipients.includes(customer.id)}
              onChange={(newChecked) => handleCheckboxChange(customer.id, newChecked)}
            />
          ))
        )}
      </FormLayout>
    </div>
  );
}
