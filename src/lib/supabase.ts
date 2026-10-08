type ContactInquiry = {
  name: string;
  email: string;
  company: string | null;
  project_type: string;
  message: string;
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

export async function submitContactInquiry(inquiry: ContactInquiry): Promise<void> {
  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error("Contact form is not configured.");
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/contact_inquiries`, {
    method: "POST",
    headers: {
      apikey: supabasePublishableKey,
      Authorization: `Bearer ${supabasePublishableKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(inquiry),
  });

  if (!response.ok) {
    throw new Error(`Contact inquiry submission failed with status ${response.status}.`);
  }
}
