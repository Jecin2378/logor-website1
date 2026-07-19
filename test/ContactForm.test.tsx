import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ContactForm from "@/components/ContactForm";

const insertMock = vi.fn().mockResolvedValue({ error: null });

vi.mock("@/utils/supabase/client", () => ({
  createClient: () => ({
    from: () => ({
      insert: insertMock,
    }),
  }),
}));

describe("ContactForm", () => {
  beforeEach(() => {
    insertMock.mockClear();
    insertMock.mockResolvedValue({ error: null });
  });

  it("renders the first step (Your Details) on mount", () => {
    render(<ContactForm />);
    expect(screen.getAllByText("Your Details").length).toBeGreaterThan(0);
    expect(screen.getByPlaceholderText("Enter your name")).toBeTruthy();
  });

  it("shows a validation error when required fields are missing on submit", async () => {
    render(<ContactForm />);
    fireEvent.click(screen.getByText("Continue"));
    fireEvent.click(screen.getByText("Continue"));
    fireEvent.click(screen.getByText("Submit & Book Free Consultation"));
    expect(
      screen.getByText(/Please fill in all required fields/i)
    ).toBeTruthy();
    expect(insertMock).not.toHaveBeenCalled();
  });

  it("submits successfully and shows the confirmation modal when required fields are filled", async () => {
    render(<ContactForm />);

    // Step 1
    fireEvent.change(screen.getByPlaceholderText("Enter your name"), {
      target: { name: "fullName", value: "Jane Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("e.g. +91 9876543210"), {
      target: { name: "phone", value: "+91 9876543210" },
    });
    fireEvent.click(screen.getByText("Continue"));

    // Step 2
    fireEvent.change(screen.getByPlaceholderText("e.g. Logor Retail Store"), {
      target: { name: "businessName", value: "Jane Store" },
    });
    fireEvent.click(screen.getByText("Continue"));

    // Step 3 - submit
    fireEvent.click(screen.getByText("Submit & Book Free Consultation"));

    await waitFor(() => {
      expect(screen.getByText("Consultation Booked!")).toBeTruthy();
    });

    expect(insertMock).toHaveBeenCalledTimes(1);
    const inserted = insertMock.mock.calls[0][0] as Record<string, unknown>;
    expect(inserted.full_name).toBe("Jane Doe");
    expect(inserted.business_name).toBe("Jane Store");
  });
});
