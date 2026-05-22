interface Station {
  stationCode: string;
  stationName: string;
  arrivalTime?: string;
  departureTime?: string;
  distance?: number;
  sequence?: number;
}

interface Props {
  route?: Station[];
}

export default function TrainRoute({
  route,
}: Props) {
  if (!route || route.length === 0) {
    return null;
  }

  return (
    <div className="rt-route-card">
      <h3>Journey Route</h3>

      <div className="rt-route-list">
        {route.map((station, index) => (
          <div
            key={index}
            className="rt-route-item"
          >
            <div className="rt-route-line">
              <div className="rt-route-dot" />

              {index !== route.length - 1 && (
                <div className="rt-route-track" />
              )}
            </div>

            <div className="rt-route-content">

  <div className="rt-route-header">
    <div>
      <strong>
        #{station.sequence}
      </strong>
    </div>

    <div>
      {station.distance ?? 0} km
    </div>
  </div>

  <h4>{station.stationCode}</h4>

  <p>{station.stationName}</p>

  <div className="rt-route-times">

    <div>
      <small>Arrival</small>
      <strong>
        {station.arrivalTime || "--:--"}
      </strong>
    </div>

    <div>
      <small>Departure</small>
      <strong>
        {station.departureTime || "--:--"}
      </strong>
    </div>

  </div>

</div>
          </div>
        ))}
      </div>
    </div>
  );
}