import got from 'got';
import { writeFile } from 'fs/promises';

export async function getProfessorDepartments() {
    try {
        const response = await got('https://keys.kent.edu/ePROD/bwgkphon.P_EnterStaffCriteria');
        const html = response.body;

        const selectRegex = /<select name="dept"[^>]*>([\s\S]*?)<\/select>/im;
        const match = selectRegex.exec(html);
        if (!match) throw new Error('Department dropdown not found');

        const optionsRegex = /<option value="([^"]*)"[^>]*>([^<]+)<\/option>/gim;
        let departments = {};
        let optionMatch;
        let counter = 1;
        while ((optionMatch = optionsRegex.exec(match[1])) !== null) {
            const key = counter.toString().padStart(3, '0');
            departments[key] = optionMatch[2].trim();
            counter++;
        }

        if (Object.keys(departments).length > 0) {
            await writeFile('departments.json', JSON.stringify(departments, null, 2));
            console.log('Departments extracted and saved to departments.json');
        } else {
            console.log('No departments found. Check the HTML structure and regular expressions.');
        }
    } catch (error) {
        console.error('An error occurred:', error.message);
    }
}
