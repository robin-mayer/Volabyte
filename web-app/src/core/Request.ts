class Request {
  private readonly baseUrl: string;

  constructor() {
    const originUrl = window.location.origin;
    if (originUrl === "http://localhost:5173") {
      this.baseUrl = "http://localhost:8080";
    } else {
      this.baseUrl = `${originUrl}/api`;
    }
  }

  private getRequestUrl(path: string): string {
    return `${this.baseUrl}${path}`;
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

export default new Request();
