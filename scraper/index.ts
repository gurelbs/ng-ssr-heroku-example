import * as puppeteer from 'puppeteer';

interface Answer {
    html: string;
    text: string
}

export const scraper = async (query: string, lang: string): Promise<Answer | null> => {
    try {
        const browser: puppeteer.Browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox", '--disable-extensions']
        });
    
        const page = await browser.newPage();
        await page.goto(`https://www.google.com/search?q=${query}&hl=${lang}`);
        const answer = await page.evaluate(() => {
            const element = (document.querySelector(".xpdopen") as HTMLDivElement)
            return element ? {
                html: element.innerHTML,
                text: element.innerText
            } : null
        });
        await browser.close();
        return answer
    } catch (error) {
        console.log(`[scraper] - error: ${error}`);
        return null
    }
};

