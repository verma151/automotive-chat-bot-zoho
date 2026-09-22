import { zohoRequest } from "./client.js";

export interface CreateLeadInput {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  city?: string;
  interestedVehicle: string;
}

export async function createLead(args: any) {
  const payload = {
    data: [
      {
        First_Name: args.firstName,
        Last_Name: args.lastName,
        Phone: args.phone,
        Email: args.email,
        City: args.city,
        Vehicle_Model: args.interestedVehicle
      }
    ]
  };

  const response = await zohoRequest("/crm/v8/Leads", {
    method: "POST",
    body: JSON.stringify(payload)
  });

  const record = response?.data?.[0];
  // console.log("response create leads",response)

  if (!record) {
    return {
      created: false,
      message: "Lead could not be created in Zoho CRM."
    };
  }

  return {
    created: true,
    leadId: record.details?.id || record.id,
    message: "Lead created successfully."
  };
}

export async function searchLead(phone: string) {
  try {
    const criteria = `(Phone:equals:${phone})`;
    const encoded = encodeURIComponent(criteria);

    const response = await zohoRequest(
      `/crm/v8/Leads/search?criteria=${encoded}`,
      {
        method: "GET",
      }
    );

    // No lead found
    if (!response?.data || response.data.length === 0) {
      return {
        found: false,
        message: "No lead was found for this phone number.",
        lead: null,
      };
    }

    const lead = response.data[0];

    // console.log("response search leads",response)

    return {
      found: true,
      message: "Lead found successfully.",
      lead: {
        id: lead.id,
        firstName: lead.First_Name ?? null,
        lastName: lead.Last_Name ?? null,
        phone: lead.Phone ?? null,
        email: lead.Email ?? null,
        city: lead.City ?? null,
        vehicle: lead.Vehicle_Model ?? null,
        status: lead.Lead_Status ?? null,
      },
    };
  } catch (error: any) {
    console.error("Search lead failed:", error);

    return {
      found: false,
      lead: null,
      error: true,
      message: "Unable to search the lead in Zoho CRM.",
    };
  }
}