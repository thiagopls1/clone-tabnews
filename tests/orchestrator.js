import retry from "async-retry";

async function waitForAllServices() {
  await waitForWebServer();

  async function waitForWebServer() {
    await retry(fetchStatusPage, {
      retries: 100,
      maxTimeout: 1000,
      onRetry: (error, attempt) => {
        console.log(
          `⛔ Attempt ${attempt} - Failed to fetch /api/v1/status: ${error.message}`,
        );
      },
    });

    async function fetchStatusPage() {
      const response = await fetch("http://localhost:3000/api/v1/status");
      if (!response.ok) {
        throw Error(`HTTP error ${response.status} while testing Web Server`);
      }
    }
  }
}

const orchestrator = {
  waitForAllServices,
};

export default orchestrator;
