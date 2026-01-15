import type { UploadChunkDTO } from "../models/UploadChunkDTO";

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

  async uploadFileChunk(
    token: string,
    originalFileName: string,
    chunk: File,
    parentId: string | null,
    fileId: string | null,
    isLastChunk: boolean
  ): Promise<Response> {
    const UploadChunkDTO: UploadChunkDTO = {
      parentId: parentId,
      fileId: fileId,
      isLastChunk: isLastChunk,
    };

    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
    };

    const formData = new FormData();
    formData.append(
      "uploadChunkDTO",
      new Blob([JSON.stringify(UploadChunkDTO)], { type: "application/json" })
    );
    formData.append("chunk", chunk, originalFileName);

    return await fetch(this.getRequestUrl("/files/upload/chunk"), {
      method: "POST",
      headers: headers,
      body: formData,
    });
  }
}

export default new Request(window.__APP_CONFIG__.SERVER_URL);
