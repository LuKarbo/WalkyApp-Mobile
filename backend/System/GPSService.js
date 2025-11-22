import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { WalkMapController } from '../Controllers/WalkMapController.js';

const LOCATION_TASK_NAME = 'background-location-task';

export const GPSService = {
    
    async requestLocationPermissions() {
        try {
            const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
            
            if (foregroundStatus !== 'granted') {
                throw new Error('Permiso de ubicación denegado');
            }

            const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
            
            if (backgroundStatus !== 'granted') {
                console.warn('Permiso de ubicación en segundo plano denegado');
                return { foreground: true, background: false };
            }

            return { foreground: true, background: true };
        } catch (error) {
            console.error('Error solicitando permisos de ubicación:', error);
            throw error;
        }
    },

    async checkLocationPermissions() {
        try {
            const foreground = await Location.getForegroundPermissionsAsync();
            const background = await Location.getBackgroundPermissionsAsync();
            
            return {
                foreground: foreground.status === 'granted',
                background: background.status === 'granted'
            };
        } catch (error) {
            console.error('Error verificando permisos:', error);
            return { foreground: false, background: false };
        }
    },

    async getCurrentLocation() {
        try {
            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High
            });
            
            return {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                altitude: location.coords.altitude,
                accuracy: location.coords.accuracy,
                timestamp: location.timestamp
            };
        } catch (error) {
            console.error('Error obteniendo ubicación actual:', error);
            throw error;
        }
    },

    async saveLocationToBackend(locationData) {
        try {
            console.log('📤 Enviando ubicación al backend:', locationData);
            const result = await WalkMapController.saveLocation(locationData);
            console.log('✅ Ubicación guardada en backend:', result);
            return result;
        } catch (error) {
            console.error('❌ Error guardando ubicación en backend:', error);
            throw error;
        }
    },

    async startBackgroundTracking(interval = 300) {
        try {
            console.log('🚀 Iniciando rastreo en segundo plano...');
            
            const permissions = await this.checkLocationPermissions();
            console.log('✅ Permisos verificados:', permissions);
            
            if (!permissions.background) {
                throw new Error('Se requieren permisos de ubicación en segundo plano');
            }

            const isTaskDefined = TaskManager.isTaskDefined(LOCATION_TASK_NAME);
            console.log('📋 Tarea definida:', isTaskDefined);
            
            if (!isTaskDefined) {
                console.log('🔧 Definiendo nueva tarea de ubicación...');
                TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
                    console.log('🔔 Tarea ejecutada (SEGUNDO PLANO)!', new Date().toISOString());
                    
                    if (error) {
                        console.error('❌ Error en tarea de ubicación:', error);
                        return;
                    }
                    
                    if (data) {
                        console.log('📦 Data recibida:', data);
                        const { locations } = data;
                        if (locations && locations.length > 0) {
                            const location = locations[0];
                            const locationData = {
                                latitude: location.coords.latitude,
                                longitude: location.coords.longitude,
                                altitude: location.coords.altitude,
                                accuracy: location.coords.accuracy,
                                timestamp: location.timestamp
                            };
                            
                            console.log('📍 Ubicación capturada (SEGUNDO PLANO - cada 5 min):', locationData);
                            
                            try {
                                await GPSService.saveLocationToBackend(locationData);
                            } catch (error) {
                                console.error('❌ Error guardando en backend (segundo plano):', error);
                            }
                        }
                    }
                });
            }

            console.log('⏱️ Configurando intervalo de segundo plano:', interval, 'segundos (5 minutos)');
            await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
                accuracy: Location.Accuracy.High,
                timeInterval: interval * 1000,
                distanceInterval: 50,
                foregroundService: {
                    notificationTitle: 'Walky GPS Activo',
                    notificationBody: 'Rastreando tu ubicación cada 5 minutos',
                    notificationColor: '#10b981'
                },
                pausesUpdatesAutomatically: false,
                showsBackgroundLocationIndicator: true
            });

            console.log('✅ Rastreo GPS en segundo plano iniciado (cada 5 minutos)');
            return true;
        } catch (error) {
            console.error('💥 Error iniciando rastreo en segundo plano:', error);
            throw error;
        }
    },

    async stopBackgroundTracking() {
        try {
            const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
            
            if (hasStarted) {
                await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
                console.log('🛑 Rastreo GPS en segundo plano detenido');
            }
            
            return true;
        } catch (error) {
            console.error('Error deteniendo rastreo:', error);
            throw error;
        }
    },

    async isTrackingActive() {
        try {
            return await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
        } catch (error) {
            console.error('Error verificando estado de rastreo:', error);
            return false;
        }
    },

    async startForegroundTracking(interval = 180, callback) { 
        try {
            console.log('🚀 Iniciando rastreo en primer plano...');
            
            const permissions = await this.checkLocationPermissions();
            console.log('✅ Permisos verificados:', permissions);
            
            if (!permissions.foreground) {
                throw new Error('Se requieren permisos de ubicación');
            }

            console.log('⏱️ Configurando intervalo de primer plano:', interval, 'segundos (3 minutos)');
            const subscription = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    timeInterval: interval * 1000,
                    distanceInterval: 30
                },
                async (location) => {
                    const locationData = {
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        altitude: location.coords.altitude,
                        accuracy: location.coords.accuracy,
                        timestamp: location.timestamp
                    };
                    
                    console.log('📍 Ubicación capturada (PRIMER PLANO - cada 3 min):', locationData);
                    
                    try {
                        await this.saveLocationToBackend(locationData);
                    } catch (error) {
                        console.error('❌ Error guardando en backend (primer plano):', error);
                    }
                    
                    if (callback) {
                        callback(locationData);
                    }
                }
            );

            console.log('✅ Rastreo GPS en primer plano iniciado (cada 3 minutos)');
            return subscription;
        } catch (error) {
            console.error('💥 Error iniciando rastreo en primer plano:', error);
            throw error;
        }
    },

    stopForegroundTracking(subscription) {
        try {
            if (subscription && subscription.remove) {
                subscription.remove();
                console.log('🛑 Rastreo en primer plano detenido');
            }
        } catch (error) {
            console.error('Error deteniendo rastreo en primer plano:', error);
        }
    }
};