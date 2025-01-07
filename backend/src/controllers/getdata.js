const getData = (model) => async (req, res) => {
    try {
        const data = await model.findAll();
        res.status(200).json(data);
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
};

module.exports = getData;
