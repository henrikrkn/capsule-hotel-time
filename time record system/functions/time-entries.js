const fs = require('fs').promises;
const path = require('path');

exports.handler = async (event, context) => {
    const filePath = path.join(__dirname, '../time-entries.txt');

    if (event.httpMethod === 'POST') {
        const body = JSON.parse(event.body) || {};
        const { employeeName, action, timestamp, id } = body;

        if (action === 'DELETE' && id) {
            let entries = [];
            try {
                const data = await fs.readFile(filePath, 'utf8');
                entries = JSON.parse(data || '[]');
            } catch (error) {
                console.error('Read error:', error);
            }
            const updatedEntries = entries.filter(entry => entry.id !== id);
            await fs.writeFile(filePath, JSON.stringify(updatedEntries, null, 2));
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Entry deleted successfully' }),
            };
        } else if (employeeName && action && timestamp && id) {
            let entries = [];
            try {
                const data = await fs.readFile(filePath, 'utf8');
                entries = JSON.parse(data || '[]');
            } catch (error) {
                console.error('Read error:', error);
            }
            entries.push({ id, employeeName, action, timestamp });
            await fs.writeFile(filePath, JSON.stringify(entries, null, 2));
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Entry saved successfully', timestamp }),
            };
        }
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Missing required fields' }),
        };
    } else if (event.httpMethod === 'GET') {
        try {
            const data = await fs.readFile(filePath, 'utf8');
            const entries = JSON.parse(data || '[]');
            return {
                statusCode: 200,
                body: JSON.stringify(entries),
            };
        } catch (error) {
            console.error('Read error:', error);
            return {
                statusCode: 200,
                body: JSON.stringify([]),
            };
        }
    }

    return {
        statusCode: 405,
        body: JSON.stringify({ message: 'Method not allowed' }),
    };
};