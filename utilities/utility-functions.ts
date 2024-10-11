import { getPlaiceholder } from "plaiceholder";

export function getLines(para: string, wordsPerLine: number) {
    const paraAsArr = para.split(' ');
    let lineCount = Math.ceil(paraAsArr.length / wordsPerLine);
    const brokenIntoLines = [];
    let start = 0;
    let end = wordsPerLine

    while (lineCount) {
        brokenIntoLines.push(paraAsArr.slice(start, end).join(' '));
        start = end;
        end = start + wordsPerLine;
        lineCount--;
    }

    return brokenIntoLines;
}

export default async function getBase64(imageUrl: string) {
    try {
        const res = await fetch(imageUrl);

        if (!res.ok) {
            throw new Error('image could not be fetched');
        }

        const buffer = await res.arrayBuffer();

        const { base64 } = await getPlaiceholder(Buffer.from(buffer));

        return base64;
    } catch(error) {
        if (error instanceof Error) {
            console.log(`getBase64 error - ${error}`);
        }
    }
}