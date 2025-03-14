import { useFetcher } from "@remix-run/react";
import { Page, Layout, Card, Text, Button, Icon, DescriptionList, InlineStack, Banner, Modal } from "@shopify/polaris";
import {
  RefreshIcon,
  ComposeIcon,
  ChartVerticalFilledIcon,
} from "@shopify/polaris-icons";

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
    <Page title="Get Started with SMS Automations">
      <Text variant="bodyLg">
        Welcome! Follow these steps to set up your SMS automations and start engaging with your customers effortlessly.
      </Text>
      <div style={{ marginTop: "20px" }}></div>
      <Layout>
        <Layout.Section>
          <Card>
            <DescriptionList
              items={[
                {
                  term: (
                    <InlineStack align="space-between">
                      <Text variant="headingMd">Step 1: Sync Customers</Text>
                      <Icon source={RefreshIcon}/>
                    </InlineStack>
                  ),
                  description: "Import your store's customer list so you can send targeted messages.",
                },
                {
                  term: (
                    <InlineStack align="space-between">
                      <Text variant="headingMd">Step 2: Create Automation</Text>
                      <Icon source={ComposeIcon}/>
                    </InlineStack>
                  ),
                  description: "Set up an SMS workflow to engage customers at the right time.",
                },
                {
                  term: (
                    <InlineStack align="space-between">
                      <Text variant="headingMd">Step 3: Review Insights</Text>
                      <Icon source={ChartVerticalFilledIcon}/>
                    </InlineStack>
                  ),
                  description: "Track SMS performance and optimize your campaigns.",
                },
              ]}
            />
          </Card>

          <div style={{ marginTop: "30px" }}></div>

          <Banner title="Sync Customers">
            <InlineStack align="space-between" blockAlign="center">
              <Text variant="bodyMd">
                Click below to sync customers and start setting up automations.
              </Text>
              <Button onClick={handleSync} disabled={isSyncing} variant="primary">
                {isSyncing ? "Syncing..." : "Sync Customers"}
              </Button>
            </InlineStack>
          </Banner>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
