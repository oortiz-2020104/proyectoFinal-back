'use strict';

const { validateData, findTuristicCenter, checkUpdateTuristicCenter } = require('../utils/validate');

const User = require('../models/user.model')
const TuristicCenter = require('../models/turisticCenter.model')
const Department = require('../models/department.model')
const Category = require('../models/category.model')

//* Funciones de administrador ---------------------------------------------------------------------------------------
exports.testTuristicCenter = (req, res) => {
    return res.send({ message: 'Mensaje de prueba desde el controlador de departamentos' })
}

//* Funciones de contribuidor ---------------------------------------------------------------------------------------
exports.addTuristicCenter = async (req, res) => {
    try {
        const userId = req.user.sub
        const params = req.body;
        const data = {
            user: userId,
            name: params.name,
            description: params.description,
            price: params.price,
            popularity: 0,
            link: params.link,
            department: params.department,
            category: params.category
        }
        const msg = validateData(data);
        if (!msg) {
            const checkUser = await User.findOne({ _id: userId })
            if (!checkUser) {
                return res.status(400).send({ message: 'No se ha encontrado el usuario' })
            } else {
                const checkDepartment = await findTuristicCenter(data.name)
                if (checkDepartment) {
                    return res.status(400).send({ message: 'Ya existe un centro turístico con un nombre similar' })
                } else {
                    if (data.price < 0) {
                        return res.status(400).send({ message: 'El precio debe de ser un entero positivo o cero' })
                    } else {
                        const checkDepartment = await Department.findOne({ _id: data.department })
                        if (!checkDepartment) {
                            return res.status(400).send({ message: 'No se ha encontrado el departamento' })
                        } else {
                            const checkCategory = await Category.findOne({ _id: data.category })
                            if (!checkCategory) {
                                return res.status(400).send({ message: 'No se ha encontrado la categoría' })
                            } else {
                                let turisticCenter = new TuristicCenter(data);
                                await turisticCenter.save();
                                return res.send({ message: 'Centro turístico creado' });
                            }
                        }
                    }
                }
            }
        } else {
            return res.status(400).send(msg);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error al crear el centro turístico' });
    }
}

exports.getTuristicsCenters = async (req, res) => {
    try {
        const userId = req.user.sub
        const turisticsCenters = await TuristicCenter.find({ user: userId }).populate('department').populate('category')

        if (!turisticsCenters) {
            return res.status(400).send({ message: 'Centros turísticos no encontrados' });
        } else {
            return res.send({ messsage: 'Centros turísticos encontrados', turisticsCenters });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error obteniendo los centros turísticos' });
    }
}

exports.getTuristicCenter = async (req, res) => {
    try {
        const userId = req.user.sub
        const turisticCenterId = req.params.idTuristicCenter

        const turisticCenter = await TuristicCenter.findOne({ _id: turisticCenterId }).populate('department').populate('category')
        if (!turisticCenter) {
            return res.status(400).send({ message: 'Centro turístico no encontrado' });
        } else {
            if (turisticCenter.user != userId) {
                return res.status(400).send({ message: 'Este centro turístico no te pertenece' });
            } else {
                return res.send({ messsage: 'Centro turístico encontrado', turisticCenter });

            }
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error obteniendo el centro turístico' });
    }
}

exports.updateTuristicCenter = async (req, res) => {
    try {
        const params = req.body;
        const userId = req.user.sub
        const turisticCenterId = req.params.idTuristicCenter;

        const checkTuristicCenter = await TuristicCenter.findOne({ _id: turisticCenterId })
        if (!checkTuristicCenter) {
            return res.status(400).send({ message: 'No se ha encontrado el centro turístico' })
        } else {
            if (checkTuristicCenter.user != userId) {
                return res.status(400).send({ message: 'No puedes actualizar este centro turístico' })
            } else {
                const checkUpdated = await checkUpdateTuristicCenter(params);
                if (!checkUpdated) {
                    return res.status(400).send({ message: 'Parámetros inválidos' })
                } else {
                    const checkTuristicCenterName = await findTuristicCenter(params.name);
                    if (checkTuristicCenterName && checkTuristicCenter.name != params.name && checkTuristicCenterName._id != turisticCenterId) {
                        return res.status(400).send({ message: 'Ya existe un centro turístico con un nombre similar' });
                    } else {
                        const checkDepartment = await Department.findOne({ _id: params.department })
                        if (!checkDepartment) {
                            return res.status(400).send({ message: 'No se ha encontrar el departamento' })
                        } else {
                            const checkCategory = await Category.findOne({ _id: params.category })
                            if (!checkCategory) {
                                return res.status(400).send({ message: 'No se ha encontrar la categoría' })
                            } else {
                                const updateTuristicCenter = await TuristicCenter.findOneAndUpdate({ _id: turisticCenterId }, params, { new: true }).lean();
                                if (!updateTuristicCenter) {
                                    return res.status(400).send({ message: 'No se ha podido actualizar el centro turístico' })
                                } else {
                                    return res.send({ message: 'Centro turístico actualizado', updateTuristicCenter })
                                }
                            }
                        }
                    }
                }
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error actualizando el centro turístico' });
    }
}

exports.deleteTuristicCenter = async (req, res) => {
    try {
        const params = req.body;
        const userId = req.user.sub
        const turisticCenterId = req.params.idTuristicCenter;

        const checkTuristicCenter = await TuristicCenter.findOne({ _id: turisticCenterId })
        if (!checkTuristicCenter) {
            return res.status(400).send({ message: 'No se ha encontrado el centro turístico o ya ha sido eliminado' })
        } else {
            if (checkTuristicCenter.user != userId) {
                return res.status(400).send({ message: 'No puedes eliminar este centro turístico' })
            } else {
                await TuristicCenter.findOneAndDelete({ _id: turisticCenterId })
                return res.send({ message: 'Centro turístico eliminado' })
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error actualizando el centro turístico' });
    }
}

//* Funciones de usuario registrado ---------------------------------------------------------------------------------------

//* Funciones de usuario no registrado ---------------------------------------------------------------------------------------