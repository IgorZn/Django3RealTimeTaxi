import React, { useEffect, useState } from 'react';
import { Breadcrumb, Col, Row } from 'react-bootstrap';

import { Redirect } from 'react-router-dom';
import TripCard from './TripCard';
import { getTrips } from '../services/TripService';
import { isDriver } from '../services/AuthService';

function Driver (props) {

    // HELPERS
    const [trips, setTrips] = useState([]);

    useEffect(() => {
        const loadTrips = async () => {
            const { response, isError } = await getTrips();
            if (isError) {
                setTrips([]);
            } else {
                setTrips(response.data);
            }
        }
        loadTrips();
    }, []);

    const getCurrentTrips = () => {
        return trips.filter(trip => {
            return trip.driver !== null && trip.status !== 'COMPLETED';
        });
    }

    const getRequestedTrips = () => {
        return trips.filter(trip => {
            return trip.status === 'REQUESTED';
        });
    }

    const getCompletedTrips = () => {
        return trips.filter(trip => {
            return trip.status === 'COMPLETED';
        });
    }




    if (!isDriver()) {
        return <Redirect to='/' />
    }

    return (
        <Row>
            <Col lg={12}>
                <Breadcrumb>
                    <Breadcrumb.Item href='/'>Home</Breadcrumb.Item>
                    <Breadcrumb.Item active>Dashboard</Breadcrumb.Item>
                </Breadcrumb>
                <TripCard
                    title='Current Trip'
                    trips={getCurrentTrips()}
                    group='driver'
                    otherGroup='rider'
                />
                <TripCard
                    title='Requested Trips'
                    trips={getRequestedTrips()}
                    group='driver'
                    otherGroup='rider'
                />
                <TripCard
                    title='Recent Trips'
                    trips={getCompletedTrips()}
                    group='driver'
                    otherGroup='rider'
                />
            </Col>
        </Row>
    );
}

export default Driver;