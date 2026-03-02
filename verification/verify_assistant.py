
from playwright.sync_api import sync_playwright, expect

def verify_assistant(page):
    page.goto("http://localhost:3000/#/")

    # Click on AI Helper button
    page.click("text=AI Helper")

    # Expect Assistant header to be visible
    expect(page.get_by_text("Experticket Assistant")).to_be_visible()

    # Take screenshot of the assistant
    page.screenshot(path="verification/assistant_open.png")
    print("Assistant UI verified.")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()
        try:
            verify_assistant(page)
        except Exception as e:
            print(f"Verification failed: {e}")
            page.screenshot(path="verification/assistant_failed.png")
        finally:
            browser.close()
