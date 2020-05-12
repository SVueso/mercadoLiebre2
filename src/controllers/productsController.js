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
	// Root - Show all products
	root: (req, res) => {
		res.render('products',{products,toThousand});
		// Do the magic
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		// res.send("ok, el id seleccionado es: "+req.params.productId);
		let product= products.find(product=>product.id==req.params.productId);
		res.render('detail',{product,toThousand})
		// Do the magic
	},

	// Create - Form to create
	create: (req, res) => {

		res.render('product-create-form');
		// Do the magic
	},
	
	// Create -  Method to store
	store: (req, res, next) => {
	
			let newProduct={
				id: products[products.length-1].id+1,
				name: req.body.name,
				price: Number(req.body.price),
				discount: Number(req.body.discount),
				description: req.body.description,
				image:req.files[0].filename,
				category: req.body.category,
			};
			let newDB=[...products,newProduct];
			fs.writeFileSync(productsFilePath,JSON.stringify(newDB));
			res.render('detail',{product:newProduct,toThousand})
		
		// Do the magic
	},

	// Update - Form to edit
	edit: (req, res) => {
		let producToEdit= products.find(product=>product.id==req.params.productId);
		// res.send('llegue aca tocando el boton de edit')
		res.render('product-edit-form', {product:producToEdit})
		// Do the magic
	},
	// Update - Method to update
	update: (req, res) => {
		products.forEach(product => {
			if(product.id==req.params.productId)
			{
				product.name=req.body.name;
				product.description=req.body.description;
				product.price=req.body.price;
				product.discount=req.body.discount;
				product.category=req.body.category;
			};
		});

		fs.writeFileSync(productsFilePath,JSON.stringify(products));
		let product= products.find(product=>product.id==req.params.productId);
		res.render('detail',{product,toThousand})
		// Do the magic
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		let newdb = products.filter(product=>product.id!=req.params.productId);
		fs.writeFileSync(productsFilePath,JSON.stringify(newdb));
		let visited = newdb.filter(product=>product.category=="visited");
		let insale = newdb.filter(product=>product.category=="in-sale");
		visited=visited.slice(0,4);
		insale=insale.slice(0,4);
		res.render('index',{visited,insale,toThousand})

		// Do the magic
	}
};

module.exports = controller;