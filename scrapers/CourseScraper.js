const puppeteer = require('puppeteer');
const fs = require('fs/promises');

async function scrapeCourseData() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://keys.kent.edu/ePROD/bwlkffcs.p_adv_unsecure_sel_crse_search', { waitUntil: 'networkidle0' });

    // semester select from dropdown
    const semesters = ['Summer 2024', 'Fall 2024'];
    for (const semester of semesters) {
        await page.select('select#semesterDropdownId', semester);
        await page.waitForNavigation({ waitUntil: 'networkidle0' });

        // form navigation will go here

        // select options
        await page.select('select#campusDropdownId', 'Stark Campus');
        await page.select('select#levelDropdownId', 'Undergraduate');
        await page.click('#submitButtonId'); //determine submit button id
        await page.waitForNavigation({ waitUntil: 'networkidle0' });

        // scrape course data
        const courses = await page.evaluate(() => {
            const rows = Array.from(document.querySelectorAll('table#coursesTable tbody tr'));
            return rows.map(row => {
                const cells = row.querySelectorAll('td');
                return {
                    courseCode: cells[0].innerText.trim(),
                    courseName: cells[1].innerText.trim(),
                    credits: cells[2].innerText.trim()
                };
            });
        });

        // write to JSON file
        await fs.writeFile(`courses-${semester.replace(/\s+/g, '-')}.json`, JSON.stringify(courses, null, 2));


    }

    await browser.close();
}

scrapeCourseData();
