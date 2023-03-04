exports.createAllClassificationsAndTypes = async (ClassificationType, Classification, Type) => {
    for (let i = 0; i < products.length; i++) {
        let product = products[i];
        for (let j = 0; j < product.length; j++) {
            await Classification.findOrCreate({
                where: { name: product[j].classification.name },
                attributes: ['id']
            });
            let classification = await Classification.findOne({
                where: { name: product[j].classification.name },
                attributes: ['id']
            });
            await Type.findOrCreate({
                where: { name: product[j].classification.type },
            });
            let type = await Type.findOne({
                where: { name: product[j].classification.type },
                attributes: ['id']
            });
            await ClassificationType.findOrCreate({
                where: {
                    classificationId: classification.id,
                    typeId: type.id
                }
            });
        }
    }
};