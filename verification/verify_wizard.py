
from playwright.sync_api import sync_playwright, expect

def verify_wizard_flow(page):
    # Navigate to the app
    page.goto("http://localhost:3000/#/new-sale")

    # Wait for the wizard to load - look for "Product" in the progress bar
    expect(page.get_by_text("Product").first).to_be_visible()

    # Take a screenshot of the first step
    page.screenshot(path="verification/step1_product_selection.png")

    print("Wizard Step 1 verified.")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()
        try:
            verify_wizard_flow(page)
        except Exception as e:
            print(f"Verification failed: {e}")
            page.screenshot(path="verification/failed.png")
        finally:
            browser.close()
