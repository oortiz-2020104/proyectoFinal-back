'use strict'

const { validateData, findCategory, checkUpdateCategory } = require('../utils/validate');

const Category = require('../models/category.model')
const turisticCenter = require('../models/turisticCenter.model')

exports.testCategory = (req, res) => {
    return res.send({ message: 'Mensaje de prueba desde el controlador de categorías' })
}

exports.addCategory = async (req, res) => {
    try {
        const params = req.body;
        const data = {
            name: params.name,
            description: params.description
        }
        const msg = validateData(data);
        if (!msg) {
            const checkCategory = await findCategory(data.name)
            if (checkCategory) {
                return res.status(400).send({ message: 'Ya existe una categoría similar' })
            } else {
                let category = new Category(data);
                await category.save();
                return res.send({ message: 'Categoría creada', category });
            }
        } else {
            return res.status(400).send(msg);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error al crear la categoría' });
    }
}

exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find().lean();
        if (!categories) {
            return res.status(400).send({ message: 'Categorías no encontradas' });
        } else {
            return res.send({ message: 'Categorías encontradas', categories })
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error obteniendo las categorías' });
    }
}

exports.getCategory = async (req, res) => {
    try {
        const categoryId = req.params.idCategory;
        const category = await Category.findOne({ _id: categoryId }).lean();
        if (!category) {
            return res.send({ message: 'La categoría ingresada no se ha podido encontrar' })
        } else {
            return res.send({ message: 'Categorías encontradas', category });
        }
    } catch (err) {
        console.log(err)
        return res.status(500).send({ message: 'Error obteniendo la categoría' });
    }
}

exports.updateCategory = async (req, res) => {
    try {
        const categoryId = req.params.idCategory;
        const params = req.body;

        const category = await Category.findOne({ _id: categoryId })
        if (category) {
            const checkUpdated = await checkUpdateCategory(params);
            if (checkUpdated === false) {
                return res.status(400).send({ message: 'No se han recibido parámetros' })
            } else {
                const findDefault = await findCategory('DEFAULT')
                if (findDefault.id === categoryId) {
                    return res.send({ message: 'No puede actualizar la categoría DEFAULT' })
                } else {
                    const checkCategory = await findCategory(params.name)
                    if (checkCategory && category.name != params.name) {
                        return res.status(400).send({ message: 'Ya existe una categoría con el mimso nombre' });
                    } else {
                        const categoryUpdated = await Category.findOneAndUpdate({ _id: categoryId }, params, { new: true });
                        if (!categoryUpdated) {
                            return res.status(400).send({ message: 'No se ha podido actualizar esta categoría' });
                        } else {
                            return res.send({ message: 'Categoría actualizada', categoryUpdated })
                        }
                    }
                }
            }
        } else {
            return res.status(404).send({ message: 'Esta categoría no existe' })
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error actualizando la categoría' });
    }
}

exports.deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.idCategory;
        const findDefault = await findCategory('DEFAULT')
        if (findDefault.id === categoryId) {
            return res.send({ message: 'No puede eliminar la categoría DEFAULT' })
        } else {
            const deleteCategory = await Category.findOneAndDelete({ _id: categoryId });
            if (!deleteCategory) {
                return res.status(404).send({ message: 'Categoría no encontrada o ya ha sido eliminada' })
            } else {
                const updateLodge = await turisticCenter.updateMany({ category: categoryId }, { category: findDefault.id }, { new: true })
                return res.send({ message: 'Categoría eliminada y se actualizaron los siguientes centros turísticos', updateLodge })
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error eliminando la categoría' });
    }
}