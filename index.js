const puppeteerExtra = require('puppeteer-extra');
const { selectors } = require('./consts/selectors.js');
const { delayTimeout } = require('./utils/delay.js');
const fs = require('fs')

const connectToBrowser = async (port, uuid) => {
    return puppeteerExtra.connect({
        browserWSEndpoint: `ws://127.0.0.1:${port}/devtools/browser/${uuid}`
    })
}

const main = async () => {
    let browser
    try { 
        browser = await connectToBrowser(9222, 'f545f52f-8d28-4228-97c8-782c0390aff8');
        // const context = browser.defaultBrowserContext();
        // await context.overridePermissions('https://web.telegram.org/k/#@dragonz_land_bot',['clipboard-read','clipboard-sanitized-write','clipboard-write']);

        const page = await browser.newPage()
        page.setViewport({
            width: 1600,
            height: 860,
            deviceScaleFactor: 1,
          })
        await page.goto('https://web.telegram.org/k/#@dragonz_land_bot')
        await page.waitForNavigation({ timeout: 30000 })
        await (await page.waitForSelector(selectors.playBtn)).click() // PRESS PLAY BTN
        await (await page.waitForSelector(selectors.launchBtn)).click() // PRESS LAUNCH BTN
        const frameHandle = await page.waitForSelector(selectors.botWebFrame) // GET BOT FRAME
        const frame = await frameHandle.contentFrame()
        await frame.waitForSelector(selectors.webFrame) // WAIT FOR EGG BTN
        for(let i = 0; i < 1000; i ++) {
            await (await frame.$(selectors.eggBtn)).click() // PRESS EGG BTN
            await delayTimeout()
        }


        await delayTimeout(1000)
        const taskNav = await frame.$(selectors.taskNavigator)
        await delayTimeout()
        await taskNav.click() // CLICK TASKS
        await delayTimeout(Math.random() * 5000)
        
        try {
            const dailyReward = await frame.waitForSelector(selectors.dailyReward)
            await dailyReward.click() // CLICK DAILY REWARD
            await delayTimeout(Math.random() * 5000)
            const claimReward = await frame.waitForSelector(selectors.claimBtn)
            await claimReward.click() // CLICK CLAIM DAILY REWARD
        } catch (error) {
            console.log(error.message)
        }
        await delayTimeout(Math.random() * 5000)
        const friendsNav = await frame.$(selectors.friendsNavigator)
        await delayTimeout(Math.random() * 5000)

        await friendsNav.click() // CLICK FRIENDS
        try {
            const copyBtn = await frame.waitForSelector(selectors.copyBtn)
            await delayTimeout(3000)
            await copyBtn.click() // CLICK COPY
            const copyText = await frame.evaluate(() => navigator.clipboard.readText())
            console.log(`Copied text, ${copyText}`)
            const obj = {urlText: copyText}
            fs.writeFile("url.json", JSON.stringify(obj), function(err) {
                if (err) throw err;
                console.log('writing completed');
                }
            );
        } catch (error) {
            console.error(error.message)
        }

        const youTubePage = await browser.newPage()
        youTubePage.setViewport({
            width: 1600,
            height: 860,
            deviceScaleFactor: 1,
          })
        await youTubePage.goto('https://www.youtube.com')
        await delayTimeout(Math.random() * 10000)
        await youTubePage.close() // CLOSE YOUTUBE
        const chat = await page.$(selectors.chatBody)
        await chat.click()
        await delayTimeout()
        const clostBtn = await page.waitForSelector(selectors.closeBtn)
        await clostBtn.click()
        await delayTimeout(Math.random() * 5000)
        const subscribeBtn = await page.$(selectors.chatSubscribeBtn)
        await subscribeBtn.click()
        await delayTimeout(Math.random() * 2000)
        const subscribeBtn2 = await page.waitForSelector(selectors.channelSubscribeBtn)
        await subscribeBtn2.click()
    } catch (error) {
        console.error(error)
    } finally {
        await browser?.disconnect()
    }
}
main()
