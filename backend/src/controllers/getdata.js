const getData = (model) => async (req, res) => {
    try {
        const data = await model.findAll({
            attributes: {
                exclude: ['id']
            }
        });

        // 인덱스 추가 (1부터 시작)
        const indexedData = data.map((item, index) => ({
            index: index + 1,
            ...item.toJSON()
        }));

        res
            .status(200)
            .json(indexedData);
    } catch (err) {
        console.log(err);
        res
            .status(500)
            .send('Server Error');
    }
};

module.exports = getData;
