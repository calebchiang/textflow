import { useFetcher } from "@remix-run/react";
import { Page, Layout, Card, Text, Button } from "@shopify/polaris";

/**
 * GetStarted component - Guides the user to sync customers before using the app.
 */
export default function GetStarted() {
  const fetcher = useFetcher();
  const isSyncing = fetcher.state === "submitting";

  const handleSync = () => {
    fetcher.submit(null, { method: "post", action: "/api/sync/customers" });
  };

  return (
    <Page title="Get Started">
      <Layout>
        <Layout.Section>
          <Card>
            <Text variant="headingMd">Sync Your Customers</Text>
            <Text>
              Before creating automations, sync your customer data from Shopify to get started.
            </Text>

            <Button onClick={handleSync} disabled={isSyncing} variant="primary">
              {isSyncing ? "Syncing..." : "Sync Customers"}
            </Button>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
