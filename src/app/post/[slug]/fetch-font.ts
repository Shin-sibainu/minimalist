export async function fetchFont(): Promise<ArrayBuffer | null> {
  try {
    const googleFontsUrl = `https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@700&display=swap&subset=japanese`;

    const css = await (
      await fetch(googleFontsUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1",
        },
      })
    ).text();

    const resource = css.match(/src: url\((.+)\) format\('woff2'\)/);
    if (!resource?.[1]) return null;

    const res = await fetch(resource[1]);
    if (!res.ok) return null;

    return res.arrayBuffer();
  } catch (error) {
    console.error("Failed to fetch font:", error);
    return null;
  }
}
