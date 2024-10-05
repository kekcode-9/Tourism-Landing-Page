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