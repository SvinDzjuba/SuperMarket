exports.createAllClassificationsAndTypes = async (data) => {
    const employees = data.map(shop => shop.employees);
    for (let i = 0; i < employees.length; i++) {
        let employee = employees[i];
        for (let j = 0; j < employee.length; j++) {
            await Position.findOrCreate({
                where: { name: employee[j].position },
            });
        }
    }
}