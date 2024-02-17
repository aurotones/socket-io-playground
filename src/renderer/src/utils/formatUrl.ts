import urlParse from "url-parse";

export default function formatUrl(url: string): string {
    let value = url;
    const parsedUrl = urlParse(url);

    if (parsedUrl.protocol === "localhost:" && !parsedUrl.hostname){
        // noinspection HttpUrlsUsage
        value = `http://${url}`;
    }

    return value;
}
