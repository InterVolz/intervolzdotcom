function formatHumanReadableDate(dateStr) {
    const [month, day, year] = dateStr.split('/').map(num => parseInt(num, 10));
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

module.exports = {
    formatHumanReadableDate
};