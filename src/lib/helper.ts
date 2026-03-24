
import { env } from '$env/dynamic/private';

export function toBase64(str: string) {
  try {
    return btoa(str);
  } catch (err) {
    return Buffer.from(str, 'utf8').toString('base64');
  }
};

export function fromBase64(base64: any) {
  try {
    return atob(base64);
  } catch (err) {
    return Buffer.from(base64, 'base64').toString('utf8');
  }
};

export async function request(
  method: string,
  endpoint: string,
  body = {}
) {
    let options: any = {
        method: method.toUpperCase()
    }

    if (method != 'get') {
        options = {
          method: method.toUpperCase(),
          body: JSON.stringify(body),
        }
    }

    const res = await fetch(endpoint, options);
    const json = await res.json();

    return json;
}

export function basicAuth(method: string, body: any, level = "api")
{
    const apiAuth = `changemoney_api:N4&**S%Vl0C7MubL`
    const systemAuth = `ikwuje:xaS@Di2t#7Qry19M`

    let basicToken = toBase64(apiAuth);

    if (level == 'system') {
        basicToken = toBase64(systemAuth);
    }

    const request: any = {
        headers: {
            "Authorization": `Basic ${basicToken}`,
            "Content-Type": "application/json",
        },
        method: method,
    }

    if (method != 'GET') {
        request.body = JSON.stringify(body);
    }

    return request;
}

export function getEndpoint(endpoint: string)
{
  const server = env.SERVER;
  let apiUrl = env.API_URL || 'https://monierate-currency-api-production.up.railway.app/core';
  if (server == 'LOCAL') {
    apiUrl = 'http://localhost:4001/core';
  }

  return `${apiUrl}${endpoint}`;
}

export function array_to_key_object (entries: any, property:string) {
  let entries_obj: any = {};
  for (const key in entries) {
      entries_obj[entries[key][property]] = entries[key];
  }

  return entries_obj;
}