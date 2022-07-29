'use strict'

const { validateData, checkUpdateDestiny } = require('../utils/validate');

const User = require('../models/user.model')
const TuristicCenter = require('../models/turisticCenter.model')
const Department = require('../models/department.model')
const Category = require('../models/category.model')
const Trip = require('../models/trip.model')
const Destiny = require('../models/destiny.model')

//* Funciones de administrador ---------------------------------------------------------------------------------------
exports.testDestiny = (req, res) => {
    return res.send({ message: 'Mensaje de prueba desde el controlador de destinos' })
}

//* Funciones de usuario registrado ---------------------------------------------------------------------------------------
exports.addDestiny = async (req, res) => {
    try {
        const userId = req.user.sub
        const tripId = req.params.idTrip
        const turisticCenterId = req.params.idTuristicCenter
        const params = req.body;
        const data = {
            trip: tripId,
            turisticCenter: turisticCenterId,
            startDate: params.startDate,
            endDate: params.endDate,
        }
        const msg = validateData(data);
        if (!msg) {
            const checkUser = await User.findOne({ _id: userId })
            if (!checkUser) {
                return res.status(400).send({ message: 'No se ha encontrado el usuario' })
            } else {
                const checkTrip = await Trip.findOne({ _id: tripId }).lean()
                if (!checkTrip) {
                    return res.status(400).send({ message: 'No se ha encontrado el viaje' })
                } else {
                    if (checkTrip.user != userId) {
                        return res.status(400).send({ message: 'Este viaje no te pertenece' })
                    } else {
                        const checkTuristicCenter = await TuristicCenter.findOne({ _id: turisticCenterId }).lean()
                        if (!checkTuristicCenter) {
                            return res.status(400).send({ message: 'No se ha encontrado el centro turístico' })
                        } else {
                            let date1 = new Date(data.startDate)
                            let date2 = new Date(data.endDate)
                            if (date1 == 'Invalid Date' || date2 == 'Invalid Date') {
                                return res.status(400).send({ message: 'Las fechas no son válidas' })
                            } else {
                                let startDateTrip = new Date(checkTrip.startDate);
                                let endDateTrip = new Date(checkTrip.endDate);

                                let differenceDate1_StartTrip = date1.getTime() - startDateTrip.getTime()
                                let differenteDate1_EndTrip = endDateTrip.getTime() - date1.getTime()

                                if (differenceDate1_StartTrip < 0 || differenteDate1_EndTrip < 0) {
                                    return res.status(400).send({ message: 'Ingresa una fecha de inicio entre las fechas que estableciste' })
                                } else {
                                    let differenceDate2_StartTrip = date2.getTime() - startDateTrip.getTime()
                                    let differenteDate2_EndTrip = endDateTrip.getTime() - date2.getTime()
                                    if (differenceDate2_StartTrip < 0 || differenteDate2_EndTrip < 0) {
                                        return res.status(400).send({ message: 'Ingresa una fecha de final entre las fechas que estableciste' })
                                    } else {
                                        let difference = date2.getTime() - date1.getTime();
                                        if (difference < 0) {
                                            return res.status(400).send({ message: 'Ingresa una fecha de salida superior a la de inicio' })
                                        } else {
                                            if (difference == 0) {
                                                return res.status(400).send({ message: 'No puedes establecer las mismas fechas' })
                                            } else {
                                                let destiny = new Destiny(data);
                                                await destiny.save();

                                                let newPopularity = checkTuristicCenter.popularity + 1
                                                await TuristicCenter.findOneAndUpdate({ _id: turisticCenterId }, { popularity: newPopularity }, { new: true })

                                                return res.send({ message: 'Destino añadido a tu viaje' });
                                            }
                                        }
                                    }
                                }
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

exports.getDestinies = async (req, res) => {
    try {
        const userId = req.user.sub
        const tripId = req.params.idTrip

        const trip = await Trip.findOne({ _id: tripId }).lean()
        if (!trip) {
            return res.status(400).send({ message: 'No se ha encontrado el viaje' });
        } else {
            if (trip.user != userId) {
                return res.status(400).send({ message: 'Este viaje no te pertenece' });
            } else {
                const destinies = await Destiny.find({ trip: tripId }).populate('turisticCenter').lean()
                if (!destinies) {
                    return res.status(400).send({ message: 'No se han encontrado destinos' });
                } else {
                    for (let i = 0; i < destinies.length; i++) {
                        destinies[i].startDate = new Date(destinies[i].startDate).toLocaleString()
                        destinies[i].endDate = new Date(destinies[i].endDate).toLocaleString()
                    }
                    return res.send({ messsage: 'Destinos encontrados', destinies });
                }
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error obteniendo los destinos' });
    }
}

exports.getDestiny = async (req, res) => {
    try {
        const userId = req.user.sub
        const tripId = req.params.idTrip
        const destinyId = req.params.idDestiny

        const trip = await Trip.findOne({ _id: tripId }).lean()
        if (!trip) {
            return res.status(400).send({ message: 'No se ha encontrado el viaje' });
        } else {
            if (trip.user != userId) {
                return res.status(400).send({ message: 'Este viaje no te pertenece' });
            } else {
                const destiny = await Destiny.findOne({ _id: destinyId, trip: tripId }).populate('turisticCenter').lean()
                if (!destiny) {
                    return res.status(400).send({ message: 'No se ha encontrado el destino' });
                } else {
                    destiny.startDate = new Date(destiny.startDate).toLocaleString()
                    destiny.endDate = new Date(destiny.endDate).toLocaleString()

                    return res.send({ messsage: 'Destino encontrado', destiny });
                }
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error obteniendo el destino' });
    }
}

exports.updateDestiny = async (req, res) => {
    try {
        const params = req.body;
        const userId = req.user.sub
        const tripId = req.params.idTrip
        const destinyId = req.params.idDestiny

        const trip = await Trip.findOne({ _id: tripId }).lean()
        if (!trip) {
            return res.status(400).send({ message: 'No se ha encontrado el viaje' });
        } else {
            if (trip.user != userId) {
                return res.status(400).send({ message: 'Este viaje no te pertenece' });
            } else {
                const destiny = await Destiny.findOne({ _id: destinyId, trip: tripId }).populate('turisticCenter').lean()
                if (!destiny) {
                    return res.status(400).send({ message: 'No se ha encontrado el destino' });
                } else {
                    const checkUpdated = await checkUpdateDestiny(params);
                    if (!checkUpdated) {
                        return res.status(400).send({ message: 'Parámetros inválidos' })
                    } else {
                        let date1 = new Date(params.startDate)
                        let date2 = new Date(params.endDate)
                        if (date1 == 'Invalid Date' || date2 == 'Invalid Date') {
                            return res.status(400).send({ message: 'Las fechas no son válidas' })
                        } else {
                            let startDateTrip = new Date(trip.startDate);
                            let endDateTrip = new Date(trip.endDate);

                            let differenceDate1_StartTrip = date1.getTime() - startDateTrip.getTime()
                            let differenteDate1_EndTrip = endDateTrip.getTime() - date1.getTime()

                            if (differenceDate1_StartTrip < 0 || differenteDate1_EndTrip < 0) {
                                return res.status(400).send({ message: 'Ingresa una fecha de inicio entre las fechas que estableciste' })
                            } else {
                                let differenceDate2_StartTrip = date2.getTime() - startDateTrip.getTime()
                                let differenteDate2_EndTrip = endDateTrip.getTime() - date2.getTime()
                                if (differenceDate2_StartTrip < 0 || differenteDate2_EndTrip < 0) {
                                    return res.status(400).send({ message: 'Ingresa una fecha de final entre las fechas que estableciste' })
                                } else {
                                    let difference = date2.getTime() - date1.getTime();
                                    if (difference < 0) {
                                        return res.status(400).send({ message: 'Ingresa una fecha de salida superior a la de inicio' })
                                    } else {
                                        if (difference == 0) {
                                            return res.status(400).send({ message: 'No puedes establecer las mismas fechas' })
                                        } else {
                                            const updateDestiny = await Destiny.findOneAndUpdate({ _id: destinyId }, params, { new: true }).lean();
                                            return res.send({ messsage: 'Destino actualizado', updateDestiny });
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error actualizando el destino' });
    }
}

exports.deleteDestiny = async (req, res) => {
    try {
        const userId = req.user.sub
        const tripId = req.params.idTrip
        const destinyId = req.params.idDestiny

        const trip = await Trip.findOne({ _id: tripId }).lean()
        if (!trip) {
            return res.status(400).send({ message: 'No se ha encontrado el viaje' });
        } else {
            if (trip.user != userId) {
                return res.status(400).send({ message: 'Este viaje no te pertenece' });
            } else {
                const destiny = await Destiny.findOne({ _id: destinyId, trip: tripId }).lean()
                if (!destiny) {
                    return res.status(400).send({ message: 'No se ha encontrado el destino' });
                } else {
                    const deleteDestiny = await Destiny.findOneAndDelete({ _id: destinyId })
                    return res.send({ messsage: 'Destino eliminado', deleteDestiny });
                }
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error eliminando el destino' });
    }
}