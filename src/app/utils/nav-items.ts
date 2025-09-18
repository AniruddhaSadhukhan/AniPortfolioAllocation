import { NavItem } from "../models/nav-item";

const navItemMap: Record<string, NavItem> = {
  Dashboard: { label: "Dashboard", icon: "pi-slack", routerLink: ["/view"] },
  Manage: { label: "Manage", icon: "pi-book", routerLink: ["/edit"] },
  Allocation: {
    label: "Allocation",
    icon: "pi-chart-pie",
    routerLink: ["/allocation"],
  },
  Expectation: {
    label: "Expectation",
    icon: "pi-sliders-v",
    routerLink: ["/expectations"],
  },
  Category: { label: "Category", icon: "pi-tags", routerLink: ["/category"] },
  NetWorth: {
    label: "Net Worth",
    icon: "pi-chart-line",
    routerLink: ["/net-worth"],
  },
};

/**
 * Generate an array of NavItems based on the provided pages.
 *
 * @param {...any} pages - The pages to retrieve NavItems for.
 * @return {NavItem[]} An array of NavItems corresponding to the input pages.
 */
export let getNavItems = (...pages): NavItem[] => {
  return pages.map((page) => navItemMap[page]).filter((x): x is NavItem => !!x);
};
