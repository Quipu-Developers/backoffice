const path = require('path');

const getFile_dev_member = async(req, res) => {
    const filename = req.params.filename;
    if(!filename){
        res.status(400).send('file 이름이 필요');
    }

    const filePath = path.join(__dirname, '../../../main-backend/portfolio', filename);
    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).send('파일이 존재하지 않음');
        }
    })
}

module.exports = getFile_dev_member;