import { zohoRequest } from "./client.js";

export interface CreateCaseInput {
  subject: string;
  registrationNumber: string;
  odometer: number;
  issue: string;
  serviceCenter: string;
  phone?: string;
}

export async function createServiceCase(args: any) {
  const payload = {
    data: [
      {
        Subject: `Vehicle Service - ${args.registrationNumber}`,

        Registration_Number: args.registrationNumber,

        Odometer: args.odometer,

        Issue: args.issue,

        Preferred_Service_Center: args.serviceCenter,

        Customer_Phone: args.phone || null
      }
    ]
  };

  const response = await zohoRequest("/crm/v8/Cases", {
    method: "POST",
    body: JSON.stringify(payload)
  });

  const record = response?.data?.[0];
  // console.log("response search case",response)

  if (!record) {
    return {
      created: false,
      caseId: null,
      message: "Service case could not be created."
    };
  }

  return {
    created: true,
    caseId: record.details?.id || record.id,
    message: "Service case created successfully."
  };
}