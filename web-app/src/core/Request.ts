class Request {
  private readonly baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getRequestUrl(path: string): string {
    return `${this.baseURL}${path}`;
  }

  async get(path: string, token: string | null): Promise<Response> {
    const url = this.getRequestUrl(path);
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return await fetch(url, {
      method: "GET",
      headers: headers,
    });
  }

  async post(path: string, token: string | null, body: any): Promise<Response> {
    const url = this.getRequestUrl(path);
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    });
  }

  async patch(
    path: string,
    token: string | null,
    body: any
  ): Promise<Response> {
    const url = this.getRequestUrl(path);
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return await fetch(url, {
      method: "PATCH",
      headers: headers,
      body: JSON.stringify(body),
    });
  }

  async delete(
    path: string,
    token: string | null,
    body: any
  ): Promise<Response> {
    const url = this.getRequestUrl(path);
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return await fetch(url, {
      method: "DELETE",
      headers: headers,
      body: JSON.stringify(body),
    });
  }
}

export default new Request(import.meta.env.VITE_SERVER_URL);
