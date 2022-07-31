'use strict';

const { validateData, checkUpdateTrip } = require('../utils/validate');

const User = require('../models/user.model')
const Department = require('../models/department.model')
const Category = require('../models/category.model')
const TuristicCenter = require('../models/turisticCenter.model')
const Trip = require('../models/trip.model')
const Destiny = require('../models/destiny.model')

//* Funciones de administrador ---------------------------------------------------------------------------------------
exports.testTrip = (req, res) => {
    return res.send({ message: 'Mensaje de prueba desde el controlador de viajes' })
}

//* Funciones de usuario registrado ---------------------------------------------------------------------------------------
exports.addTrip = async (req, res) => {
    try {
        const userId = req.user.sub
        const params = req.body;
        const data = {
            user: userId,
            name: params.name,
            startDate: params.startDate,
            endDate: params.endDate,
        }
        const msg = validateData(data);
        if (!msg) {
            const checkUser = await User.findOne({ _id: userId })
            if (!checkUser) {
                return res.status(400).send({ message: 'No se ha encontrado el usuario' })
            } else {
                let date1 = new Date(data.startDate)
                let date2 = new Date(data.endDate)
                if (date1 == 'Invalid Date' || date2 == 'Invalid Date') {
                    return res.status(400).send({ message: 'Las fechas no son válidas' })
                } else {
                    let today = new Date()
                    let differenceToday = date1.getTime() - today.getTime()
                    if (differenceToday < 0) {
                        return res.status(400).send({ message: 'Ingresa una fecha de inicio superior' })
                    } else {
                        let difference = date2.getTime() - date1.getTime();
                        if (difference < 0) {
                            return res.status(400).send({ message: 'Ingresa una fecha de salida superior a la de inicio' })
                        } else {
                            if (difference == 0) {
                                return res.status(400).send({ message: 'No puedes establecer las mismas fechas' })
                            } else {
                                let trip = new Trip(data);
                                await trip.save();
                                return res.send({ message: 'Viaje creado' });
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
        return res.status(500).send({ message: 'Error al crear el viaje' });
    }
}

exports.getTrips = async (req, res) => {
    try {
        const userId = req.user.sub

        const trips = await Trip.find({ user: userId }).lean();
        if (!trips) {
            return res.status(400).send({ message: 'Viajes no encontrados' });
        } else {
            for (let i = 0; i < trips.length; i++) {
                trips[i].startDate = new Date(trips[i].startDate).toLocaleString()
                trips[i].endDate = new Date(trips[i].endDate).toLocaleString()
            }
            return res.send({ messsage: 'Viajes encontrados', trips });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error obteniendo los viajes' });
    }
}

exports.getTrip = async (req, res) => {
    try {
        const userId = req.user.sub
        const tripId = req.params.idTrip

        const trip = await Trip.findOne({ _id: tripId }).lean();
        if (!trip) {
            return res.status(400).send({ message: 'Viaje no encontrado' });
        } else {
            if (trip.user != userId) {
                return res.status(400).send({ message: 'Este viaje no te pertenece' });
            } else {
                trip.startDate = new Date(trip.startDate).toLocaleString()
                trip.endDate = new Date(trip.endDate).toLocaleString()
                return res.send({ messsage: 'Viajes encontrados', trip });
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error obteniendo el viaje' });
    }
}

exports.updateTrip = async (req, res) => {
    try {
        const params = req.body;
        const userId = req.user.sub
        const tripId = req.params.idTrip

        const checkTrip = await Trip.findOne({ _id: tripId })
        if (!checkTrip) {
            return res.status(400).send({ message: 'No se ha encontrado el viaje' })
        } else {
            if (checkTrip.user != userId) {
                return res.status(400).send({ message: 'No puedes actualizar este viaje' })
            } else {
                const checkUpdated = await checkUpdateTrip(params);
                if (!checkUpdated) {
                    return res.status(400).send({ message: 'Parámetros inválidos' })
                } else {
                    const updateTrip = await Trip.findOneAndUpdate({ _id: tripId }, params, { new: true }).lean();
                    if (!updateTrip) {
                        return res.status(400).send({ message: 'No se ha podido actualizar el viaje' })
                    } else {
                        return res.send({ message: 'Viaje actualizado', updateTrip })
                    }
                }
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error actualizando el viaje' });
    }
}

exports.deleteTrip = async (req, res) => {
    try {
        const userId = req.user.sub
        const tripId = req.params.idTrip

        const checkTrip = await Trip.findOne({ _id: tripId })
        if (!checkTrip) {
            return res.status(400).send({ message: 'No se ha encontrado el viaje' })
        } else {
            if (checkTrip.user != userId) {
                return res.status(400).send({ message: 'No puedes eliminar este viaje' })
            } else {
                const deleteTrip = await Trip.findOneAndDelete({ _id: tripId });
                if (!deleteTrip) {
                    return res.status(400).send({ message: 'No se ha podido eliminar el viaje' })
                } else {
                    await Destiny.deleteMany({ trip: tripId })
                    return res.send({ message: 'Viaje eliminado' })
                }
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error eliminando el viaje' });
    }
}

//* Funciones de contribuidor ---------------------------------------------------------------------------------------

//* Funciones de usuario no registrado ---------------------------------------------------------------------------------------
