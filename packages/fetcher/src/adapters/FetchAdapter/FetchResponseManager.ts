import { AxiosRequestConfig } from "axios";

export class FetchResponseManager {
  constructor(private readonly config: AxiosRequestConfig) {}

  public validateStatus = async (response: Response) => {
    if (this.config.validateStatus?.(response?.status)) {
      return response;
    }

    throw response;
  };

  public handleDownloadProgress = async (response: Response) => {
    if (!response.body) return response;

    if (typeof this.config.onDownloadProgress === "function") {
      const contentLength = response.headers.get("content-length");
      const total = parseInt(contentLength, 10);
      let loaded = 0;

      return new Response(
        new ReadableStream({
          start: async (controller) => {
            const reader = response.body.getReader();
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              loaded += value.byteLength;
              this.config.onDownloadProgress({
                loaded,
                total,
                lengthComputable: Boolean(loaded / total),
              });
              controller.enqueue(value);
            }
            controller.close();
          },
        }),
        response
      );
    }

    return response;
  };

  private async convertResponseToData(response: Response) {
    switch (this.config.responseType) {
      case "arraybuffer":
        return await response.arrayBuffer();
      case "blob":
        return await response.blob();
      case "json":
        return await response.json();
      case "formData":
        return await response.formData();
      case "stream":
        return response.body;
      default:
        return await response.text();
    }
  }

  public formatResponse = (request: Request) => async (response: Response) => {
    return {
      config: this.config,
      status: response.status,
      statusText: response.statusText,
      headers: [...response.headers].reduce(
        (acc, [key, value]) => ((acc[key] = value), acc),
        {} as Dictionary<string>
      ),
      data: await this.convertResponseToData(response),
      request,
      response,
    };
  };
}
