import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { DashboardSkeleton, PortalDashboardSkeleton, StatCardSkeleton } from "@/components/LoadingSkeleton";

describe("LoadingSkeleton", () => {
  it("renders DashboardSkeleton without crashing", () => {
    const { container } = render(<DashboardSkeleton />);
    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
  });

  it("renders PortalDashboardSkeleton without crashing", () => {
    const { container } = render(<PortalDashboardSkeleton />);
    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
  });

  it("renders StatCardSkeleton without crashing", () => {
    const { container } = render(<StatCardSkeleton />);
    expect(container.querySelector(".animate-pulse")).toBeTruthy();
  });
});
