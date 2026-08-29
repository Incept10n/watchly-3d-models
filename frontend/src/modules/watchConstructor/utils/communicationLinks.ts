export type CommunicationChannel = "avito" | "vk" | "email";

export const communicationLinks: Record<CommunicationChannel, string> = {
  avito: import.meta.env.VITE_AVITO_URL,
  vk: import.meta.env.VITE_VK_URL,
  email: import.meta.env.VITE_EMAIL_URL,
};