'use strict';

const { validateData, findDepartment, checkUpdateDepartment } = require('../utils/validate');

const Department = require('../models/department.model')
const TuristicCenter = require('../models/turisticCenter.model')

exports.testDepartment = (req, res) => {
    return res.send({ message: 'Mensaje de prueba desde el controlador de departamentos' })
}

exports.addDepartment = async (req, res) => {
    try {
        const params = req.body;
        const data = {
            name: params.name,
            description: params.description
        }
        const msg = validateData(data);
        if (!msg) {
            const checkDepartment = await findDepartment(data.name)
            if (checkDepartment) {
                return res.status(400).send({ message: 'Ya existe un departamento similar' })
            } else {
                let department = new Department(data);
                await department.save();
                return res.send({ message: 'Departamento creado', department });
            }
        } else {
            return res.status(400).send(msg);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error al crear el departamento' });
    }
}

exports.getDepartments = async (req, res) => {
    try {
        const departments = await Department.find().lean();
        if (!departments) {
            return res.status(400).send({ message: 'Departamentos no encontrados' });
        } else {
            return res.send({ message: 'Departamentos encontrados', departments })
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error obteniendo los departamentos' });
    }
}

exports.getDepartment = async (req, res) => {
    try {
        const departmentId = req.params.idDepartment;
        const department = await Department.findOne({ _id: departmentId }).lean();
        if (!department) {
            return res.send({ message: 'El departamento ingresado no se ha podido encontrar' })
        } else {
            return res.send({ message: 'Departamento encontrado', department });
        }
    } catch (err) {
        console.log(err)
        return res.status(500).send({ message: 'Error obteniendo el departamento' });
    }
}

exports.updateDepartment = async (req, res) => {
    try {
        const departmentId = req.params.idDepartment;
        const params = req.body;

        const department = await Department.findOne({ _id: departmentId })
        if (department) {
            const checkUpdated = await checkUpdateDepartment(params);
            if (checkUpdated === false) {
                return res.status(400).send({ message: 'No se han recibido parámetros' })
            } else {
                const findDefault = await findDepartment('DEFAULT')
                if (findDefault.id === departmentId) {
                    return res.send({ message: 'No puede actualizar el departamento DEFAULT' })
                } else {
                    const checkDepartment = await findDepartment(params.name)
                    if (checkDepartment && department.name != params.name && checkDepartment._id != departmentId) {
                        return res.status(400).send({ message: 'Ya existe un departamento con el mimso nombre' });
                    } else {
                        const departmentUpdated = await Department.findOneAndUpdate({ _id: departmentId }, params, { new: true });
                        if (!departmentUpdated) {
                            return res.status(400).send({ message: 'No se ha podido actualizar este departamento' });
                        } else {
                            return res.send({ message: 'Departamento actualizado', departmentUpdated })
                        }
                    }
                }
            }
        } else {
            return res.status(404).send({ message: 'Este departamento no existe' })
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error actualizando el departamento' });
    }
}

exports.deleteDepartment = async (req, res) => {
    try {
        const departmentId = req.params.idDepartment;
        const findDefault = await findDepartment('DEFAULT')
        if (findDefault.id === departmentId) {
            return res.send({ message: 'No puede eliminar el departamento DEFAULT' })
        } else {
            const deleteDepartment = await Department.findOneAndDelete({ _id: departmentId });
            if (!deleteDepartment) {
                return res.status(404).send({ message: 'Departamento no encontrado o ya ha sido eliminado' })
            } else {
                const updateLodge = await TuristicCenter.updateMany({ department: departmentId }, { department: findDefault.id }, { new: true })
                return res.send({ message: 'Departamento eliminado y se actualizaron los siguientes centros turísticos', updateLodge })
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error eliminando el departamento' });
    }
}