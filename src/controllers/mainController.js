const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = x => {
    x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x))
        x = x.replace(pattern, "$1.$2");
    return x;
}

const controller = {
	root: (req, res) => {
		let visited = products.filter(product=>product.category=="visited");
		let insale = products.filter(product=>product.category=="in-sale");
		visited=visited.slice(0,4);
		insale=insale.slice(0,4);
		res.render('index',{visited,insale,toThousand})
	},
	search: (req, res) => {
		// Do the magic
	},
};

module.exports = controller;
