import React from "react";
import { useState } from "react";
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';
import SubwayIcon from '@mui/icons-material/Subway';
import { Chip, Link } from "@mui/material";
import { LineChart } from "@mui/x-charts";


interface GeoRef {
    type: string;
    coordinates: number[];
}

interface SubwayRidershipType {
    transit_timestamp: Date;
    station_complex_id: string;
    station_complex: string;
    borough: string;
    routes: string;
    payment_method: string;
    ridership: number;
    transfers: number;
    latitude: number;
    longitude: number;
    georeference: GeoRef;
    itsuid: string;
}

function reviver(key: string, value: any): any {
    switch (key) {
        case 'transit_timestamp':
            return new Date(Date.parse(value));
        case 'ridership':
            return Number(value);
        case 'transfers':
            return Number(value);
        case 'latitude':
            return Number(value);
        case 'longitude':
            return Number(value);
        case 'georeference':
            return value as GeoRef;
        default:
            return value;
    }
}



export default function SubwayRidership () {
    const [showSubwayRidership, setShowSubwayRidership] = useState(false);
    const [data, setData] = useState<SubwayRidershipType[]>();
    const limit = 2500;
    const days = 14;
    const fetchSubwayRidershipData = () => {
        if (data == null) {
            const last_month = new Date(new Date().setDate(new Date().getDate() - days)).toISOString().split('T')[0];
            fetch(`https://data.ny.gov/resource/wujg-7c2s.json?$where=transit_timestamp%20%3E%20"${last_month}"&$limit=${limit}`)
            .then(response => response.text())
            .then((data) => {
                const parsed: SubwayRidershipType[] = JSON.parse(data, reviver) as SubwayRidershipType[];
                setData(parsed);
            });
        }
        setShowSubwayRidership(true);
    };
    return (
        <>
        <Button onClick={fetchSubwayRidershipData} variant="contained" disabled={showSubwayRidership}>See hourly subway ridership data
                <SubwayIcon sx={{ marginLeft: 1 }} />
        </Button>
        <React.Suspense fallback={<div>Loading...</div>}>
        {data != null && showSubwayRidership && (
            <>
            <br />
            <Button onClick={() => setShowSubwayRidership(false)} variant="outlined">Hide subway ridership data
            </Button>
            <Link sx={{pl : 1}} href="https://data.ny.gov/Transportation/MTA-Subway-Hourly-Ridership-Beginning-February-202/wujg-7c2s" target="_blank">
                <Chip label="data" color="default" size="small" />
            </Link>
            <br />
            <DataGrid
                rows={data}
                getRowId={row => row.itsuid}
                initialState={
                    {
                        sorting: {
                            sortModel: [{field: 'transit_timestamp', sort: 'desc'}],
                        }
                    }
                }
                columns={[
                    { field: 'transit_timestamp', headerName: 'Transit Timestamp', width: 200, sortable: true, },
                    { field: 'station_complex_id', headerName: 'Station ID', width: 200 },
                    { field: 'station_complex', headerName: 'Station', width: 200 },
                    { field: 'borough', headerName: 'Borough', width: 200 },
                    { field: 'routes', headerName: 'Routes', width: 200 },
                    { field: 'payment_method', headerName: 'Payment Method', width: 200 },
                    { field: 'ridership', headerName: 'Ridership', width: 200 },
                    { field: 'transfers', headerName: 'Transfers', width: 200 },
                    { field: 'latitude', headerName: 'Latitude', width: 200 },
                    { field: 'longitude', headerName: 'Longitude', width: 200 },
                ]}
            />
        </>
        )}
        </React.Suspense>
        </>
    );
}
