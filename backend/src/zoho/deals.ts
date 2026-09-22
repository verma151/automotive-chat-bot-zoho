import { zohoRequest } from "./client.js";

export async function getDealStatus(phone: string) {
  const criteria = `(Customer_Phone:equals:${phone})`;

  const response = await zohoRequest(
    `/crm/v8/Deals/search?criteria=${encodeURIComponent(criteria)}`
  );

  if (!response?.data || response.data.length === 0) {
    return {
      found: false,
      message: "No active deal was found for this phone number.",
      deal: null
    };
  }

  const deal = response.data[0];
// console.log("response search deals",response)
  return {
    found: true,
    message: "Deal found.",
    deal: {
      id: deal.id,
      customerName: deal.Contact_Name?.name ?? null,
      vehicle: deal.Vehicle ?? null,
      stage: deal.Stage ?? null,
      customerPhone: deal.Customer_Phone ?? null,
      testDriveStatus: deal.Test_Drive_Status ?? null,
      testDriveDate: deal.Test_Drive_Date ?? null
    }
  };
}

export async function getVehicleInfo(vehicle: string) {
  const vehicles: Record<string, any> = {
    thar: {
      name: "Thar",
      variants: ["AX", "LX"],
      features: [
        "4x4 capability",
        "Touchscreen infotainment",
        "Cruise control",
        "Adventure-focused design"
      ],
      demoPricing: "₹11.5 lakh onwards"
    },

    xuv700: {
      name: "XUV700",
      variants: ["MX", "AX3", "AX5", "AX7"],
      features: [
        "ADAS",
        "Panoramic sunroof",
        "Connected technology",
        "Advanced safety features"
      ],
      demoPricing: "₹14 lakh onwards"
    },

    "scorpio-n": {
      name: "Scorpio-N",
      variants: ["Z2", "Z4", "Z6", "Z8", "Z8L"],
      features: [
        "Body-on-frame SUV",
        "4x4 capability",
        "Large cabin",
        "Advanced safety features"
      ],
      demoPricing: "₹13.5 lakh onwards"
    }
  };

  const key = vehicle.toLowerCase().trim();
  const data = vehicles[key];

  if (!data) {
    return {
      found: false,
      message: `I don't have vehicle information for ${vehicle}.`,
      vehicle: null
    };
  }

  return {
    found: true,
    message: "Vehicle information found.",
    vehicle: data
  };
}