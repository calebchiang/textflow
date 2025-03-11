import { useEffect, useState } from "react";
import { FormLayout, Select, Button } from "@shopify/polaris";
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

  const handleChange = (selected: string[]) => {
    setRecipients(selected);
  };

  return (
    <div>
      <FormLayout>
        <Select
          label="Select Recipients"
          options={customers.map((customer) => ({
            label: `${customer.firstName} ${customer.lastName}`,
            value: customer.id,
          }))}
          onChange={handleChange}
          value={recipients}
          disabled={loading}
          multiple
        />
      </FormLayout>
    </div>
  );
}
