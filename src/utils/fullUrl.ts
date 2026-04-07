import { CLIENT_URL } from "@/constants";

export default function fullUrl(uniqueUrl: string): string {
  return `${CLIENT_URL}/${uniqueUrl}`;
}
